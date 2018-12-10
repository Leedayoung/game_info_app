const selenium = require('selenium-webdriver');
require('chromedriver');
var cheerio = require('cheerio');
const By = selenium.By;

//find_team_results('skt').then(function (result) {
//    console.log(result);
//});
//find_play_results().then(function (result) {
//    console.log(result);

//});
async function find_team_results(team_name) {
    let driver = await new selenium.Builder().forBrowser("chrome").build();
    try {
        await driver.get('http://best.gg/team/' + team_name);
    } finally {
        var result = [];
        var elem = driver.getPageSource();
        elem.then(function (v) {
            var $ = cheerio.load(v);
            var play_list = $('.team__matches-item-content-header-match-info');
            play_list.each(function () {
                var my_team_name = $('.team__matches-item-content-header-match-info-my-team', $(this)).text();
                var my_team_score = $('.team__matches-item-content-header-match-info-my-score', $(this)).text();
                var oppo_name = $('.team__matches-item-content-header-match-info-opponent-team', $(this)).text();
                var oppo_score = $('.team__matches-item-content-header-match-info-opponent-score', $(this)).text();
                result.push([[my_team_name, my_team_score],[oppo_name, oppo_score]]);
            });
        })
        await driver.quit();
        return result;
    }
}

async function find_play_results() {
    let driver = await new selenium.Builder().forBrowser("chrome").build();
    try {
        await driver.get('http://best.gg/');
    } finally {
        var result = [];
        var elem = driver.getPageSource();
        elem.then(function (v) {
            var $ = cheerio.load(v);
            var schedule_list = $('li', '.home__schedule-list');
            schedule_list.each(function () {
                var list = [];
                var date = $('.home__schedule-item-title-date', $(this)).text();
                list.push(date);
                var team = $('.home__schedule-item-score-item', $(this));
                team.each(function () {
                    var team_name = $('.home__schedule-item-score-item-name', $(this)).text();
                    var team_score = $('.home__schedule-item-score-item-score', $(this)).text();
                    list.push([team_name, team_score]);
                });
                result.push(list);
            });
        })
        await elem;
        await driver.quit();
        return result;
    }
}