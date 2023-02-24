import axios from 'axios';
import logger from './logger';
import CONST from '../const';
import { convertToGithubApiUrl } from './utils';

async function get(githubLink: string, params: Object = {}) {
    let options = {params: params, headers: {}};
    if(process.env.GITHUB_TOKEN != undefined){
        options.headers = {'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`};
    }
    const response = await axios.get(githubLink, options);
    return response.data;
};

export async function getAssignedDate(issueLink: string) {
    let page = 1;
    while(true){
        const issueParams = {
            per_page: 100,
            page: page
        }
        const comments = await get(issueLink, issueParams);
        for(const comment of comments){
            if(comment.user.login === CONST.MELVIN && CONST.ASSIGNED_REGEX.test(comment.body)){
                return new Date(comment.created_at);
            }
        }
        if(comments.length === 0){
            break;
        }
        page += 1;
    }
    return false;
};

export async function getPRDetails(PRLink: string) {
    let data = await get(PRLink);
    let PRDetails = {
        createdAt: new Date(data.created_at),
        mergedAt: new Date(data.merged_at),
        changedFiles: data.changed_files
    }
    return PRDetails;
}

export async function getIssueDetails(issueLink: string) {
    let issueData = await get(issueLink);
    let helpWantedAt: string = undefined;
    let page = 1;
    let found = false;
    while(true){
        const issueParams = {
            per_page: 100,
            page: page
        }
        let issueTimeline = await get(convertToGithubApiUrl(issueLink, 'timeline'), issueParams);
        for(const event of issueTimeline){
            if(event.event === 'labeled' && event.label?.name === CONST.HELP_WANTED){
                helpWantedAt = event.created_at;
                break;
            }
        }
        if(issueTimeline.length === 0 || found){
            break;
        }
        page += 1;
    }
    let issueDetails = {
        createdAt: new Date(issueData.created_at),
        helpWantedAt: helpWantedAt ? new Date(helpWantedAt) : undefined
    }
    return issueDetails;
}