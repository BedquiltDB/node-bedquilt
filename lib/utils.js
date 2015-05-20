// Utils

/** Various result projection functions
 */
var project = {
  column: function(columnName) {
    return function(result) {
      return result.rows.map(function(row) {
        return row[columnName];
      });
    };
  },
  single: function(columnName) {
    return function(result) {
      return result.rows[0][columnName];
    };
  }
};

module.exports.project = project;
