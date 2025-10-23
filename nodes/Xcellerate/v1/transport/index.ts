import {
	IDataObject,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IRequestOptions,
} from 'n8n-workflow';

export async function xcellerateApiRequest(
	this: IExecuteFunctions|ILoadOptionsFunctions,
	uri: string,
	options: IRequestOptions = {},
	returnAll = false,
	wrapped: string = 'data',
) {
	if (returnAll) {
		return await xcellerateApiRequestAll.call(this, uri, options, wrapped);
	}
	const response = await _xcellerateApiCall.call(this, uri, options);
	return response[wrapped] ?? [];
}

async function xcellerateApiRequestAll(
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
		responseData = await _xcellerateApiCall.call(this, uri, options)
		returnData.push.apply(returnData, responseData[wrapped] as IDataObject[]);
		page ++;
	} while (responseData['links']['next'] !== null)

	return returnData;
}

async function _xcellerateApiCall(this: IExecuteFunctions|ILoadOptionsFunctions, uri: string, options: IRequestOptions) {
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
	return this.helpers.request(requestOptions);
}

export function buildHttpRequest(
	{
		method = 'GET',
		query = {},
		body = {},
		timeout = 10_000,
		returnAll = false
	}: BuildHttpRequestParams
): IRequestOptions {
	let requestOptions: IRequestOptions;
	requestOptions = {
		method: method as IRequestOptions['method'],
		json: true,
		qs: query as IRequestOptions['qs'],
		body: body as IRequestOptions['body'],
		timeout: timeout,
	};

	if (returnAll && requestOptions.qs?.perPage !== undefined) {
		delete requestOptions.qs.perPage;
	}

	if (returnAll && requestOptions.qs?.page !== undefined) {
		delete requestOptions.qs.page;
	}

	return requestOptions;
}


interface BuildHttpRequestParams {
	method?: string;
	query?: Record<string, any>;
	body?: Record<string, any>;
	timeout?: number;
	returnAll?: boolean;
}
