export { renderers } from '../../renderers.mjs';

async function subscribeEmail(email, source) {
  {
    console.error("Beehiiv API credentials not configured");
    return {
      success: false,
      message: "Newsletter service not configured. Please try again later."
    };
  }
}

const prerender = false;
const POST = async ({ request }) => {
  const contentType = request.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Invalid content type. Expected application/json."
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
  try {
    const body = await request.json();
    const { email, source } = body;
    if (!email || typeof email !== "string") {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Email is required."
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    const result = await subscribeEmail(email, source);
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Subscribe API error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Invalid request body."
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
