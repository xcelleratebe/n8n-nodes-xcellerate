import { IDataObject, IExecuteFunctions, INodeProperties, updateDisplayOptions } from 'n8n-workflow';
import { queryAble, returnAllOrLimit } from '../../descriptions';
import { buildHttpRequest, xcellerateApiRequest } from '../../transport';

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
	const query: string = this.getNodeParameter('query', index) as string;
	let requestOptions = buildHttpRequest({
		query: {
			columns: [
				'id',
				'name',
				'state',
			],
			query: query,
			perPage: this.getNodeParameter('limit', index, 20),
		},
		returnAll: returnAll,
	});

	responseData = await xcellerateApiRequest.call(
		this,
		'/groups',
		requestOptions,
		returnAll,
	)

	return this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData.map((group: ApiGroup) => {
			return {
				id: group.id,
				name: group.name,
				enabled: !!group.state,
			} as unknown as Group;
		}) as IDataObject),
		{ itemData: { item: index } },
	);
}

