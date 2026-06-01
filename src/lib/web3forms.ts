const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

type Web3FormsPayload = Record<string, string | number | boolean | undefined>;

export async function sendWeb3Form(payload: Web3FormsPayload) {
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    throw new Error('Missing VITE_WEB3FORMS_ACCESS_KEY in environment.');
  }

  const response = await fetch(WEB3FORMS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      access_key: accessKey,
      from_name: 'New Krishna Traders TVS Website',
      ...payload,
    }),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Web3Forms could not send the message.');
  }

  return result;
}
