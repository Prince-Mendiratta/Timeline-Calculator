import CONST from '../const';

/**
 * Add / to the end of any URL if not present
 * @param {String} url
 * @returns {String}
 */
function addTrailingForwardSlash(url: string) {
    if (!url.endsWith('/')) {
        return `${url}/`;
    }
    return url;
}
/**
 * Converts the Github Web link to API link and adds extra path
 * @param link Github Web Link
 * @param addPath Which path to append at the end
 * @returns {string}
 */
export function convertToGithubApiUrl(link: string, addPath: string = undefined): string {
    link = link.replace(CONST.GITHUB_DOMAIN, CONST.API_GITHUB_DOMAIN);
    link = link.replace(CONST.NORMAL_PR_PATH, CONST.API_PR_PATH);
    if(addPath){
        link = addTrailingForwardSlash(link);
        link = link + addPath;
    }
    return link;
}

export function getBusinessDays(startDate, endDate) {
    // Get the start and end dates as UTC timestamps
    var start = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    var end = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  
    // Calculate the difference in milliseconds between the two dates
    var millisecondsPerDay = 1000 * 60 * 60 * 24;
    var difference = end - start;
  
    // Calculate the number of whole weeks between the two dates
    var weeks = Math.floor(difference / (millisecondsPerDay * 7));
  
    // Calculate the number of remaining days after whole weeks have been subtracted
    var remainingDays = Math.floor((difference % (millisecondsPerDay * 7)) / millisecondsPerDay);
  
    // Calculate the number of weekends in the remaining days
    var weekends = 0;
    for (var i = 0; i < remainingDays; i++) {
      var day = new Date(startDate.getTime() + (i * millisecondsPerDay)).getDay();
      if (day == 0 || day == 6) {
        weekends++;
      }
    }
  
    // Calculate the total number of business days
    var businessDays = (weeks * 5) + (remainingDays - weekends);
  
    return businessDays;
  }
  