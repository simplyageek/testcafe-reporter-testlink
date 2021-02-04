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

        reportTestStart (/*name, testMeta*/) {
        },

        _renderErrors (errs) {
            this.report += this.indentString('<![CDATA[', 8);
            errs.forEach((err, idx) => {
                err = this.formatError(err, `${idx + 1}) `);

                this.report += '\n';
                this.report += this.indentString(err, 8);
                this.report += '\n';
            });
            this.report += this.indentString(']]>\n', 8);
        },

        reportTestDone (name, testRunInfo, meta) {
            const hasErr = !!testRunInfo.errs.length;
            const testStatus = hasErr ? 'f' : 'p';

            if (!testRunInfo.skipped) {
                this.report += this.indentString(`<testcase external_id="${meta.test_id}">\n`, 4);
                this.report += this.indentString(`<timestamp>${
                    moment().utc().format('YYYY-MM-DD HH:mm:ss')}</timestamp>\n`, 8);
                this.report += this.indentString(`<result>${testStatus}</result>\n`, 8);
                this.report += this.indentString('<notes>\n', 8);
                if (hasErr) {
                    this.report += this.indentString('Automated test failed on:\n', 8);
                    this.report += this.indentString(this.userAgents + '\n', 8);
                    this._renderErrors(testRunInfo.errs);
                }
                else {
                    this.report += this.indentString('Automated test passed on:\n', 8);
                    this.report += this.indentString(this.userAgents + '\n', 8);
                }
                this.report += this.indentString('</notes>\n', 8);
                this.report += this.indentString('</testcase>\n', 4);
            }
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
