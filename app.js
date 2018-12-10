const selenium = require('selenium-webdriver');
require('chromedriver');
var cheerio = require('cheerio');
const By = selenium.By;
find_play_results().then(function (result) {
    console.log(result);

});

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
                var team = $('.home__schedule-item-score-item', $(this));
                team.each(function () {
                    var team_name = $('.home__schedule-item-score-item-name', $(this));
                    
                    var team_score = $('.home__schedule-item-score-item-score', $(this));
                    list.push([team_name.text(), team_score.text()]);
                });
                //console.log($(team_name).text());
                result.push(list);
            });
        })
        await elem;
        await driver.quit();
        return result;
    }
}