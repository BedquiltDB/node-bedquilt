/*jshint node: true*/
/*jshint esnext: true*/
/*global require exports*/

/** Various result projection functions
 */
var project = {
  column: () => {
    return (result) => {
      return result.rows.map((row) => {
        return row.bq_result;
      });
    };
  },
  single: () => {
    return (result) => {
      if (result.rows.length === 0) {
        return null;
      } else {
        return result.rows[0].bq_result;
      }
    };
  }
};

module.exports.project = project;
