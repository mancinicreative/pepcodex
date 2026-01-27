export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: {
      hasBeehiivKey: !!process.env.BEEHIIV_API_KEY,
      hasBeehiivPubId: !!process.env.BEEHIIV_PUBLICATION_ID
    }
  });
}
