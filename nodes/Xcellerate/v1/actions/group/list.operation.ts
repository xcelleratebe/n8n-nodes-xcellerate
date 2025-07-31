import {
	DeclarativeRestApiSettings,
	IDataObject,
	IExecuteFunctions,
	INodeProperties,
	updateDisplayOptions,
} from 'n8n-workflow';
import { queryAble, returnAllOrLimit } from '../../descriptions';
import { xcellerateApiRequest, xcellerateApiRequestAll } from '../../transport';
import HttpRequestOptions = DeclarativeRestApiSettings.HttpRequestOptions;

export const properties: INodeProperties[] = [
	... returnAllOrLimit,
	... queryAble,
];

const displayOptions = {
	show: {
		resource: ['group'],
		operation: ['list'],
	}
}

export const description = updateDisplayOptions(
	displayOptions,
	properties
);

export async function execute(this: IExecuteFunctions, index: number) {
	let responseData;
	const returnAll = this.getNodeParameter('returnAll', index);
	let requestOptions: HttpRequestOptions = {
		qs: {
			columns: [
				'id',
				'name',
				'state',
			]
		}
	};

	requestOptions.qs = requestOptions.qs ?? {};
	const query: string = this.getNodeParameter('query', index) as string;
	if (query !== '') {
		requestOptions.qs.query = query;
	}

	const endpoint = '/groups';
	if (returnAll) {
		responseData = await xcellerateApiRequestAll.call(this, endpoint, requestOptions);
	} else {
		requestOptions.qs.perPage = this.getNodeParameter('limit', 0, 20);

		responseData = await xcellerateApiRequest.call(
			this,
			endpoint,
			requestOptions
		)
		responseData = responseData.data;
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData.map((group: ApiGroup) => {
			return {
				id: group.id,
				name: group.name,
				enabled: !!group.state,
			} as unknown as Group;
		}) as IDataObject),
		{ itemData : { item: index } },
	)

	return executionData;
}

