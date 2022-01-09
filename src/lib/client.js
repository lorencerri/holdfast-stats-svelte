import { Appwrite } from 'appwrite';

const sdk = new Appwrite();
sdk.setEndpoint('https://app.plexidev.org/v1').setProject('paste');

export { sdk };
