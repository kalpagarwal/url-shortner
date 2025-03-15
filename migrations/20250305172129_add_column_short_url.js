/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('urls', function (table) {
    table.string('short_url', 255).defaultTo('fix_needed'); // Step 1: Add with a default value
  }).then(() => {
    return knex.raw(`
      ALTER TABLE urls ALTER COLUMN short_url DROP DEFAULT; 
    `); // Step 2: Remove default after adding the column
  });
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('urls', function (table) {
    table.dropColumn('short_url');
  });
};
