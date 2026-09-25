# WeConnect Branch Documentation: revert-10-zahraa1-dev

## Overview

This branch is a focused reverted snapshot rather than a complete copy of the full application. The branch currently contains a small number of files related to dashboard, review, stock management, and database work.

## Files available

The branch contains database/weconnect_db.sql, frontend/weconnect/src/views/Dashboard.vue, frontend/weconnect/src/views/Reviews.vue, frontend/weconnect/src/views/StockManagement.vue, and README.md.

## Database

The SQL database file is database/weconnect_db.sql. Open it to inspect the database structure and determine the tables and relationships represented by this snapshot.

Do not import the SQL into a shared database without first checking whether it matches the database already being used by the team.

## Dashboard

The dashboard implementation is frontend/weconnect/src/views/Dashboard.vue.

## Reviews

The reviews page is frontend/weconnect/src/views/Reviews.vue.

## Stock management

The stock management page is frontend/weconnect/src/views/StockManagement.vue.

## Important limitation

This branch does not contain the full backend, frontend application configuration, package files, or complete router structure visible on the newer development and main branches. It should therefore be treated as a preserved change set or reference snapshot rather than assumed to be independently runnable.

## Accessing the branch

Clone the repository and switch to revert-10-zahraa1-dev:

git checkout revert-10-zahraa1-dev

Then inspect the files listed above.

For the complete integrated application, use main or development instead.

## Purpose

Use this branch when you need to recover or compare the specific dashboard, review, stock management, or database state preserved by the revert.
