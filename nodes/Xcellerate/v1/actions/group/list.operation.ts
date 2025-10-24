import { IDataObject, IExecuteFunctions, INodeProperties, updateDisplayOptions } from 'n8n-workflow';
import { queryAble, returnAllOrLimit, sortAble } from '../../descriptions';
import { buildHttpRequest, xcellerateApiRequest } from '../../transport';

export const properties: INodeProperties[] = [
	... returnAllOrLimit,
	... queryAble,
	... sortAble([
		{
			name: 'Group name',
			value: 'name',
		},
		{
			name: 'Agent count',
			value: 'agent_count',
		},
		{
			name: 'Group priority',
			value: 'priority',
		}
	])
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
	let requestOptions = buildHttpRequest({
		query: {
			columns: [
				'id',
				'name',
				'state',
			],
		},
		returnAll: returnAll,
	});

	responseData = await xcellerateApiRequest.call(
		this,
		'/groups',
		requestOptions,
		returnAll,
		{
			index: index,
		}
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

