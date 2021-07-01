import { Email } from '../library/email';
import { MessageMetadata } from '../library/gmail-api';
import decodeBase64url from './decodeBase64url';

export default (data: MessageMetadata): Email => {
  const headers = data.payload.headers.reduce(
    (acc, header) => {
      if (header.name === 'Subject') {
        acc.subject = header.value;
      }
      if (header.name === 'From') {
        acc.from = header.value;
      }
      return acc;
    },
    { from: '', subject: '' } as Email
  );
  const bodyParts = (data.payload?.parts || [])
    .filter((part) => part.mimeType === 'text/plain')
    .map((part) => {
      const data64 = part.body.data;
      return decodeBase64url(data64);
    });
  return {
    ...headers,
    labelIds: data.labelIds,
    body: bodyParts.join(''),
  };
};
