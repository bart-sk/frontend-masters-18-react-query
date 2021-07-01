/* eslint-disable */
import Cookies from 'js-cookie';
import ky from 'ky';
import { Label, MessageListItem, MessageMetadata } from '../library/gmail-api';
import { GmailUser } from '../library/user';

let accessToken = '';

export const setApiAccessToken = (token: string): void => {
  accessToken = token;
  Cookies.set('accessToken', token);
};

export const getAccessToken = (): string => {
  if (!accessToken) {
    accessToken = Cookies.get('accessToken') ?? '';
  } 
  return accessToken;
};

export const removeAccessToken = (): void => {
  accessToken = '';
  Cookies.remove('accessToken');
};

export const getUserProfile = async (
  userId?: string
): Promise<GmailUser | null> => {
  return userId && accessToken
    ? (ky
        .get(`https://gmail.googleapis.com/gmail/v1/users/${userId}/profile`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .json() as Promise<GmailUser>)
    : null;
};

export const getLabels = async (userId?: string) => {
  return userId && accessToken
    ? (ky
        .get(`https://gmail.googleapis.com/gmail/v1/users/${userId}/labels`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .json() as Promise<{ labels: Label[] }>)
    : null;
};

export const getMessages = async (userId?: string) => {
  return userId && accessToken
    ? (ky
        .get(
          `https://gmail.googleapis.com/gmail/v1/users/${userId}/messages?maxResults=5`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .json() as Promise<{ messages: MessageListItem[] }>)
    : null;
};

export const getMessage = async (
  userId: string,
  messageId: string,
  format: 'metadata' | 'full' = 'metadata'
) => {
  return userId && messageId && accessToken
    ? (ky
        .get(
          `https://gmail.googleapis.com/gmail/v1/users/${userId}/messages/${messageId}?format=${format}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .json() as Promise<MessageMetadata>)
    : null;
};
