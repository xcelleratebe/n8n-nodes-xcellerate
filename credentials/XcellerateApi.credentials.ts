import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class XcellerateApi implements ICredentialType {
	name = 'xcellerateApi';
	displayName = 'Xcellerate API';

	documentationUrl = 'https://docs.xcellerate.app';

	properties: INodeProperties[] = [
		// The credentials to get from user and save encrypted.
		// Properties can be defined exactly in the same way
		// as node properties.
		{
			displayName: 'Api URL',
			name: 'URL',
			type: 'string',
      default: 'https://api.xcellerate.app',
			required: true,
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
		},
		{
			displayName: 'Tenant ID',
			name: 'tenantID',
			type: 'string',
			default: '',
			required: true,
		}
	];

	// This credential is currently not used by any node directly
	// but the HTTP Request node can use it to make requests.
	// The credential is also testable due to the `test` property below
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-Tenant-ID': '={{$credentials.tenantID}}',
				'Authorization': '={{"Bearer " + $credentials.apiKey}}'
			}
		},
	};

	// The block below tells how this credential can be tested
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.URL + "/api/v1"}}',
			url: '/users/me',
		},
	};
}
