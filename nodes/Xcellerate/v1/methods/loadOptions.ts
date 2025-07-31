import { IHttpRequestMethods, ILoadOptionsFunctions, INodePropertyOptions, IRequestOptions } from 'n8n-workflow';
import { xcellerateApiRequest } from '../transport';

export async function getCommands(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	let requestOptions: IRequestOptions;
	requestOptions = {
		method: 'GET' as IHttpRequestMethods,
		json: true,
	}
	const response = await xcellerateApiRequest.call(this, '/actions', requestOptions)
	return response.data.map((action: Action) => {
		return {
			name: action.name,
			description: action.command,
			value: action.command,
		};
	});
}

export async function getScripts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	let requestOptions: IRequestOptions;
	requestOptions = {
		method: 'GET' as IHttpRequestMethods,
		json: true,
	}
	const response = await xcellerateApiRequest.call(this, '/scripts', requestOptions)
	return response.data.map((script: Script) => {
		return {
			name: script.name,
			value: script.id,
			description: script.type === 'CMDDOS' ? 'Command' : 'Powershell',
		};
	});
}

export async function getPackages(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	let requestOptions: IRequestOptions;
	requestOptions = {
		method: 'GET' as IHttpRequestMethods,
		json: true,
	}
	const response = await xcellerateApiRequest.call(this, '/app-deploy/packages', requestOptions)
	return response.data.map((appdeployPackage: Package) => {
		return {
			name: appdeployPackage.title,
			value: appdeployPackage.original_package_id,
			description: appdeployPackage.description
		};
	});
}
