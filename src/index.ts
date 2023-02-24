import * as dotenv from 'dotenv'
dotenv.config()

import { getAssignedDate, getPRDetails, getIssueDetails } from './helpers/github';
import logger from './helpers/logger';
import { convertToGithubApiUrl, getBusinessDays } from './helpers/utils';
import CONST from './const';

async function main(issueLink: string, PRLink: string) {
    const issueDetails = await getIssueDetails(convertToGithubApiUrl(issueLink));
    const assignedDate = await getAssignedDate(convertToGithubApiUrl(issueLink, 'comments'));
    const PRDetails = await getPRDetails(convertToGithubApiUrl(PRLink));
    const daysElapsed = getBusinessDays(assignedDate, PRDetails.mergedAt);
    let timelineAmount: string = CONST.NO_BONUS;
    if(daysElapsed <= 3){
        timelineAmount = CONST.BONUS;
    }else if(daysElapsed > 9){
        timelineAmount = CONST.PENALTY;
    }
    logger.info(`${CONST.SEED_TEXT}\n\nHere's the Issue timeline analysis:\n🐛 Issue created at: ${issueDetails.createdAt.toUTCString()}\n${issueDetails.helpWantedAt ? `🧯 Help Wanted at: ${issueDetails.helpWantedAt.toUTCString()}\n` : ''}🕵🏻  Contributor assigned at: ${assignedDate.toUTCString()}\n🛸 PR created at: ${PRDetails.createdAt.toUTCString()}\n🎯 PR merged at: ${PRDetails.mergedAt.toUTCString()}\n⌛ Business Days Elapsed between assignment and PR merge: ${daysElapsed}\n\n💰 Timeline Bonus/Penalty: ${timelineAmount}\n\nIf there were any OOO days holidays, please reconsider the bonus based on above timeline!`);
    return timelineAmount;
};

const sampleTest = process.argv.includes('--sample');
if(sampleTest){
    const SAMPLE_ISSUE = 'https://github.com/Expensify/App/issues/14307';
    const SAMPLE_PR = 'https://github.com/Expensify/App/pull/15245';
    main(SAMPLE_ISSUE, SAMPLE_PR);
}

export default main;