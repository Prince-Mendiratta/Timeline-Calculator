import * as dotenv from 'dotenv'
dotenv.config()

import { getAssignedDate, getPRDetails, getIssueDetails } from './helpers/github';
import logger from './helpers/logger';
import { convertToGithubApiUrl, getBusinessDays } from './helpers/utils';
import CONST from './const';

const SAMPLE_ISSUE = 'https://github.com/Expensify/App/issues/14307';
const SAMPLE_PR = 'https://github.com/Expensify/App/pull/15245';

async function main(issueLink: string, PRLink: string) {
    const issueDetails = await getIssueDetails(convertToGithubApiUrl(issueLink));
    const assignedDate = await getAssignedDate(convertToGithubApiUrl(issueLink, 'comments'));
    const PRDetails = await getPRDetails(convertToGithubApiUrl(PRLink));
    const daysElapsed = getBusinessDays(assignedDate, PRDetails.mergedAt);
    let timelineAmount: string = 'No bonus applicable';
    if(daysElapsed <= 3){
        timelineAmount = '50% Bonus! 🎉';
    }else if(daysElapsed > 9){
        timelineAmount = '50% Penalty! 😱'
    }
    console.log(`${CONST.SEED_TEXT}\n\nHere's the Issue timeline analysis:\n🐛 Issue created at: ${issueDetails.createdAt}\n${issueDetails.helpWantedAt ? `🧯 Help Wanted at: ${issueDetails.helpWantedAt}\n` : ''}🕵🏻  Contributor assigned at: ${assignedDate}\n🛸 PR created at: ${PRDetails.createdAt}\n🎯 PR merged at: ${PRDetails.mergedAt}\n⌛ Days Elapsed between assignment and PR merge: ${daysElapsed}\n\n💰 Timeline Bonus/Penalty: ${timelineAmount}`);
};

main(SAMPLE_ISSUE, SAMPLE_PR);