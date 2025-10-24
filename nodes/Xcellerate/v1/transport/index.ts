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
	props: ApiRequestProperties = {}
) {
	const { wrapped = 'data', index = 0 } = props;

	if (returnAll) {
		return await xcellerateApiRequestAll.call(this, uri, options, {
			wrapped: wrapped,
			index: index,
		});
	}
	const response = await _xcellerateApiCall.call(this, uri, options, {
		wrapped: wrapped,
		index: index,
	});
	return response[wrapped] ?? [];
}

async function xcellerateApiRequestAll(
	this: IExecuteFunctions|ILoadOptionsFunctions,
	uri: string,
	options: IRequestOptions = {},
	props: ApiRequestProperties = {}
) {
	const { wrapped = 'data', index = 0 } = props;
	let responseData;
	const returnData:IDataObject[]  = [];

	options.qs = options.qs ?? {};
	options.qs.perPage = 100;

	let page = 1;
	do {
		options.qs.page = page;
		responseData = await _xcellerateApiCall.call(this, uri, options, {
			wrapped: wrapped,
			index: index,
		})
		returnData.push.apply(returnData, responseData[wrapped] as IDataObject[]);
		page ++;
	} while (responseData['links']['next'] !== null)

	return returnData;
}

async function _xcellerateApiCall(
	this: IExecuteFunctions|ILoadOptionsFunctions,
	uri: string,
	options: IRequestOptions,
	props: ApiRequestProperties = {}
) {
	const { index = 0 } = props;

	const credentials = await this.getCredentials('xcellerateApi');
	const serverUrl = `${credentials.URL}/api/v1`;
	const apiKey = credentials.apiKey;
	const tenantId = credentials.tenantID;

	let additionalQuery: Record<string, any> = {};
	let sortKey = this.getNodeParameter('sortBy', index, null) as string | null;
	let perPage = this.getNodeParameter('limit', index, null) as number;
	let page = this.getNodeParameter('page', index, 1) as number;
	let query = this.getNodeParameter('query', index, '') as string;

	if (sortKey !== null) {
		additionalQuery.sort = sortKey;
		additionalQuery.direction = this.getNodeParameter('sortDirection', index, 'desc') as string;
	}


	if (perPage !== null) {
		additionalQuery.perPage = perPage;
	}
	if (additionalQuery.page === undefined) {
		additionalQuery.page = page;
	}

	if (query !== '') {
		additionalQuery.query = query;
	}

	options.qs = {
		... options.qs,
		... additionalQuery,
	}

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
	const response = await this.helpers.request(requestOptions);

	this.logger.debug(`Request URL: ${requestOptions.uri}`);
	this.logger.debug(JSON.stringify(response));

	return response;
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

interface ApiRequestProperties {
	wrapped?: string;
	index?: number;
}

interface BuildHttpRequestParams {
	method?: string;
	query?: Record<string, any>;
	body?: Record<string, any>;
	timeout?: number;
	returnAll?: boolean;
}
