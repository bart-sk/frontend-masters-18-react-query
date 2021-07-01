import { Label } from '../library/gmail-api';

export default (labelId: string, labels: Label[]): Label | null => {
  return labels.find((label) => label.id === labelId) ?? null;
};
