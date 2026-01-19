/**
 * Beehiiv Newsletter API Integration
 *
 * Environment variables required:
 * - BEEHIIV_API_KEY: Your Beehiiv API key
 * - BEEHIIV_PUBLICATION_ID: Your publication ID
 */

interface BeehiivSubscribeResponse {
  data: {
    id: string;
    email: string;
    status: string;
    created: number;
  };
}

interface BeehiivErrorResponse {
  errors: Array<{
    code: string;
    message: string;
  }>;
}

export interface SubscribeResult {
  success: boolean;
  message: string;
  subscriberId?: string;
}

/**
 * Subscribe an email to the Beehiiv newsletter
 *
 * @param email - Email address to subscribe
 * @param source - Optional source/UTM parameter for tracking
 * @returns SubscribeResult with success status and message
 */
export async function subscribeEmail(
  email: string,
  source?: string
): Promise<SubscribeResult> {
  const apiKey = import.meta.env.BEEHIIV_API_KEY;
  const publicationId = import.meta.env.BEEHIIV_PUBLICATION_ID;

  // Validate environment variables
  if (!apiKey || !publicationId) {
    console.error('Beehiiv API credentials not configured');
    return {
      success: false,
      message: 'Newsletter service not configured. Please try again later.',
    };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      message: 'Please enter a valid email address.',
    };
  }

  try {
    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          reactivate_existing: true,
          send_welcome_email: true,
          utm_source: source || 'website',
          utm_medium: 'organic',
          utm_campaign: 'peptide_library',
          referring_site: 'https://peptidelibrary.com',
        }),
      }
    );

    if (response.ok) {
      const data = (await response.json()) as BeehiivSubscribeResponse;
      return {
        success: true,
        message: 'Successfully subscribed! Check your email to confirm.',
        subscriberId: data.data.id,
      };
    }

    // Handle specific error cases
    if (response.status === 409) {
      return {
        success: true,
        message: 'You are already subscribed!',
      };
    }

    if (response.status === 400) {
      const errorData = (await response.json()) as BeehiivErrorResponse;
      const errorMessage = errorData.errors?.[0]?.message || 'Invalid request';
      return {
        success: false,
        message: errorMessage,
      };
    }

    if (response.status === 401 || response.status === 403) {
      console.error('Beehiiv API authentication failed');
      return {
        success: false,
        message: 'Newsletter service error. Please try again later.',
      };
    }

    // Generic error handling
    console.error(`Beehiiv API error: ${response.status}`);
    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  } catch (error) {
    console.error('Beehiiv subscribe error:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection and try again.',
    };
  }
}
