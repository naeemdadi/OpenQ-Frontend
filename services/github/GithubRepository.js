import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { GET_USER_BY_ID, GET_USER_BY_NAME, GET_ORG_BY_ID, GET_ORG_BY_NAME, GET_ISSUE, GET_ISSUE_BY_ID, GET_ISSUES_BY_ID, GET_ORGS_BY_ISSUES } from './graphql/query';
import fetch from 'cross-fetch';
import { setContext } from '@apollo/client/link/context';

class GithubRepository {
	constructor() { }

	getRandomPAT = () => {
		let patsArray = process.env.NEXT_PUBLIC_PATS.split(' ');
		let randomToken = patsArray[Math.floor(Math.random() * patsArray.length)];
		return randomToken;
	};

	httpLink = new HttpLink({ uri: 'https://api.github.com/graphql', fetch });

	authLink = setContext((_, { headers }) => {
		const token = this.getRandomPAT();
		return {
			headers: {
				...headers,
				Authorization: `Bearer ${token}`,
			},
		};
	});

	client = new ApolloClient({
		uri: 'https://api.github.com/graphql',
		link: this.authLink.concat(this.httpLink),
		cache: new InMemoryCache(),
	});

	async fetchIssueByUrl(issueUrl) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_ISSUE, variables: { issueUrl },
				});
				resolve(result.data.resource);
			} catch (e) {
				reject(e);
			}
		});

		return promise;
	}

	parseIssueData(rawIssueResponse) {
		const responseData = rawIssueResponse.data.node;
		const { title, body, url, createdAt, closed, id, bodyHTML, titleHTML } = responseData;
		const repoName = responseData.repository.name;
		const avatarUrl = responseData.repository.owner.avatarUrl;
		const owner = responseData.repository.owner.login;
		const twitterUsername = responseData.repository.owner.twitterUsername;
		const labels = responseData.labels.edges.map(edge => edge.node);
		return { id, title, body, url, repoName, owner, avatarUrl, labels, createdAt, closed, bodyHTML, titleHTML, twitterUsername };
	}
	parseIssuesData(rawIssuesResponse) {
		const responseData = rawIssuesResponse.data.nodes;
		return responseData.map((elem) => {

			const { title, body, url, createdAt, closed, id, bodyHTML, titleHTML } = elem;
			const repoName = elem.repository.name;
			const avatarUrl = elem.repository.owner.avatarUrl;
			const owner = elem.repository.owner.login;
			const labels = elem.labels.edges.map(edge => edge.node);
			return { id, title, body, url, repoName, owner, avatarUrl, labels, createdAt, closed, bodyHTML, titleHTML };
		});
	}

	async fetchIssueById(issueId) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_ISSUE_BY_ID, variables: { issueId },
				});
				resolve(this.parseIssueData(result));
			} catch (e) {
				reject(e);
			}
		});

		return promise;
	}

	async getIssueData(issueIds) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_ISSUES_BY_ID, variables: { issueIds },
				});
				resolve(this.parseIssuesData(result));
			} catch (e) {
				reject(e);
			}
		});

		return promise;
	}

	async fetchOrgsWithIssues(issueIds) {

		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_ORGS_BY_ISSUES, variables: { issueIds },
				});
				resolve(result.data.nodes);
			} catch (e) {
				reject(e);
			}
		});

		return promise;
	}

	async fetchOrgOrUserByLogin(login) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const organizationResult = await this.fetchOrganizationByLogin(login);
				resolve(organizationResult);
			} catch (e) {
				const userResult = await this.fetchUserByLogin(login);
				resolve(userResult);
				console.log(e);
				reject(e);
			}
		});

		return promise;
	}

	async fetchOrganizationByLogin(login) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_ORG_BY_NAME, variables: { login },
				});
				resolve(result.data.organization);
			} catch (e) {
				reject(e);
			}
		});

		return promise;
	}

	async fetchUserByLogin(login) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_USER_BY_NAME, variables: { login },
				});
				resolve(result.data.user);
			} catch (e) {
				reject(e);
			}
		});

		return promise;
	}

	async fetchOrgOrUserById(id) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const organizationResult = await this.fetchOrganizationById(id);
				if (organizationResult.__typename == "Organization") {
					resolve(organizationResult);
				} else {
					const userResult = await this.fetchUserById(id);
					resolve(userResult);
				}
			} catch (e) {
				console.log(e);
				reject(e);
			}
		});

		return promise;
	}

	async fetchUserById(userId) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_USER_BY_ID, variables: { userId },
				});
				resolve(result.data.node);
			} catch (e) {
				console.log(e);
				reject(e);
			}
		});

		return promise;
	}

	async fetchOrganizationById(orgId) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				const result = await this.client.query({
					query: GET_ORG_BY_ID, variables: { orgId },
				});
				resolve(result.data.node);
			} catch (e) {
				console.log(e);
				reject(e);
			}
		});

		return promise;
	}

	async parseOrgIssues(issueIds) {
		const nodes = await this.fetchOrgsWithIssues(issueIds);
		const organizations = [];
		nodes.forEach((node) => {
			if (!organizations.some((organization => organization.login === node.repository.owner.login))) {
				organizations.push(node.repository.owner);
			}
		});
		return organizations;
	}
}


export default GithubRepository;
