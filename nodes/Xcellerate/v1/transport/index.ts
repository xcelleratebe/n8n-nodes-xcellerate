import {
	IDataObject,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IRequestOptions,
} from 'n8n-workflow';

export async function xcellerateApiRequest(
	this: IExecuteFunctions|ILoadOptionsFunctions,
	uri: string,
	options: IRequestOptions = {}
) {
	const credentials = await this.getCredentials('xcellerateApi');
	const serverUrl = `${credentials.URL}/api/v1`;
	const apiKey = credentials.apiKey;
	const tenantId = credentials.tenantID;

	const requestOptions: IRequestOptions = {
		... options,
		headers: {
			'X-Tenant-UUID': tenantId,
			'Authorization': `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
		},
		uri: `${serverUrl}${uri}`,
		json: true
	}

	return await this.helpers.request(requestOptions);
}

export async function xcellerateApiRequestAll(
	this: IExecuteFunctions|ILoadOptionsFunctions,
	uri: string,
	options: IRequestOptions = {},
	wrapped: string = 'data',
) {
	this.logger.error('LOOPING!');
	let responseData;
	const returnData:IDataObject[]  = [];

	options.qs = options.qs ?? {};
	options.qs.perPage = 100;

	let page = 1;
	do {
		options.qs.page = page;
		responseData = await xcellerateApiRequest.call(
			this,
			uri,
			options
		);

		returnData.push.apply(returnData, responseData[wrapped] as IDataObject[]);
		page ++;
	} while (responseData['links']['next'] !== null)

	return returnData;
}
