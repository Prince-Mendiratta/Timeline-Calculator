import axios from 'axios';
import logger from './logger';
import CONST from '../const';
import { convertToGithubApiUrl } from './utils';

/**
 * Helper function to send a GET request to github API
 * and return the results
 * @param githubLink Github Endpoint
 * @param params Any extra parameters
 * @returns {Promise<Object>} JSON response data
 */
async function get(githubLink: string, params: Object = {}) {
    let options = {params: params, headers: {}};
    // Use .env file to get more requests limit
    if(process.env.GITHUB_TOKEN != undefined){
        options.headers = {'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`};
    }
    const response = await axios.get(githubLink, options);
    return response.data;
};

/**
 * Hits the /issues/{issue number}/comments endpoint and
 * filters through the comments to find the assigned comment and date
 * @param issueLink Github API Endpoint
 * @returns {Promise<Date>}
 */
export async function getAssignedDate(issueLink: string): Promise<Date> {
    let page = 1;
    logger.debug('Getting assigned date.');
    // Need to iterate through pages if a long conversation has happened in the issue.
    while(true){
        const issueParams = {
            per_page: 100,
            page: page
        }
        const comments = await get(issueLink, issueParams);
        for(const comment of comments){
            if(comment.user.login === CONST.MELVIN && CONST.ASSIGNED_REGEX.test(comment.body)){
                logger.debug(`Got assigned date at page - ${page}.`);
                return new Date(comment.created_at);
            }
        }
        if(comments.length === 0){
            break;
        }
        page += 1;
    }
};

/**
 * Hits the /pulls/{pull number} endpoint and get the details about the PR
 * @param PRLink Github API Endpoint
 * @returns {Promise<Object>}
 */
export async function getPRDetails(PRLink: string) {
    logger.debug('Getting PR details.');
    let data = await get(PRLink);
    let PRDetails = {
        createdAt: new Date(data.created_at),
        mergedAt: new Date(data.merged_at),
        changedFiles: data.changed_files
    }
    return PRDetails;
}

/**
 * Hits the /issues/{issue number} endpoint and /issues/{issue number}/timeline
 * endpoint to get the Issue creation and Label dates.
 * @param issueLink Github API Endpoint
 * @returns {Promise<Object>}
 */
export async function getIssueDetails(issueLink: string) {
    logger.debug('Getting Issue details.');
    let issueData = await get(issueLink);
    let helpWantedAt: string = undefined;
    let page = 1;
    let found = false;
    logger.debug('Getting Label details.');
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