const moment = require('moment');

module.exports = function () {
    return {
        noColors:   true,
        report:     '',
        startTime:  null,
        path:       null,
        userAgents: null,

        reportTaskStart (startTime, userAgents) {
            this.startTime = startTime;
            this.userAgents = userAgents.join(', ');
        },

        reportFixtureStart (name, path) {
            this.path = path;
        },

        reportTestStart (/* name, testMeta */) {
            // optional
        },

        _renderErrors (errs) {
            errs.forEach((err, idx) => {
                err = this.formatError(err, `${idx + 1}) `);

                this.report += '\n';
                this.report += this.indentString(err, 8);
                this.report += '\n';
            });
        },

        reportTestDone (name, testRunInfo, testMeta) {
            const hasErr = !!testRunInfo.errs.length;
            const testStatus = hasErr ? 'f' : 'p';

            this.report += this.indentString(`<testcase> external_id="${testMeta.test_id}"`, 4);
            this.report += this.indentString(`<timestamp>${
                moment().utc().format('YYYY-MM-DD HH:mm:ss')}</timestamp>`, 8);
            this.report += this.indentString(`<result>${testStatus}</result>`, 8);
            this.report += this.indentString('<notes>', 8);
            if (hasErr) {
                this.report += this.indentString('Automated test failed on:\n', 8);
                this.report += this.indentString(this.userAgents, 8);
                this._renderErrors(testRunInfo.errs);
            }
            else {
                this.report += this.indentString('Automated test passed on:\n', 8);
                this.report += this.indentString(this.userAgents, 8);
            }
            this.report += this.indentString('</notes>', 8);
            this.report += this.indentString('</testcase>', 4);
        },

        reportTaskDone (/* endTime, passed, warnings */) {

            this.write('<?xml version="1.0" encoding="UTF-8" ?>')
                .newline()
                .write('<results>')
                .newline()
                .write(this.report);

            this.setIndent(0)
                .write('</results>');
        }
    };
};
