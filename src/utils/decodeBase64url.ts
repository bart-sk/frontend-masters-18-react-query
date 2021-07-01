export default (input: string): string => {
  // Replace non-url compatible chars with base64 standard chars
  let decoded = input.replace(/-/g, '+').replace(/_/g, '/');

  // Pad out with standard base64 required padding characters
  const pad = decoded.length % 4;
  if (pad) {
    if (pad === 1) {
      throw new Error(
        'InvalidLengthError: Input base64url string is the wrong length to determine padding'
      );
    }
    decoded += new Array(5 - pad).join('=');
  }

  return atob(decoded);
};
