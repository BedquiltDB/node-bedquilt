/*jshint node: true*/
/*jshint esnext: true*/
/*global require exports*/

/** Various result projection functions
 */
var project = {
  column: (columnName) => {
    return (result) => {
      return result.rows.map((row) => {
        return row[columnName];
      });
    };
  },
  single: (columnName) => {
    return (result) => {
      return result.rows[0][columnName];
    };
  }
};

module.exports.project = project;
