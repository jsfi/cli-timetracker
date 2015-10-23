# cli-timetracker

> Track your tasks with your cli

![dependencies](https://david-dm.org/jsfi/cli-timetracker.svg)

This is a very early release. Changes and a real readme will follow soon.

## Getting Started

Clone the repository, then link it with npm:

```
git clone git@github.com:jsfi/cli-timetracker.git
cd cli-timetracker
npm link
timetracker -p
```

The last line should return: `No tasks found.`

## Command Line Arguments

### default

Everything that is not behind a flag or an option will be added to the task string.

#### Example

```shell
timetracker Log this task
//adds task "Log this task" with the current time
```

### diff

The `--diff` flag or the `-d` alias will add the following number in minutes from the current time (or subtract it if the number is negative).

#### Example

```shell
timetracker -d 5 Log this task
//adds task "Log this task" with the time 5 minutes in the future

timetracker -d -5 Log this task
//adds task "Log this task" with the time 5 minutes in the past
```

### at

The `--at` flag or the `-t` alias will set the time. The following argument will be split by all none number characters (`/\D/`).

The last part will set the minutes.
The part before will set the hours.
The part before will set the day of the month.
The part before will set the month.
The part before will set the year.

#### Example

```shell
timetracker -t 5 Log this task
//adds task "Log this task" and sets the minute to 5 (yyyy-mm-ddTHH:05).

timetracker -t 10:5 Log this task
//adds task "Log this task" and sets the hour to 10 and the minute to 5 (yyyy-mm-ddT10:05).

timetracker -t 20T10:5 Log this task
//adds task "Log this task" and sets the day to 20th, the hour to 10 and the minute to 5 (yyyy-mm-20T10:05).

timetracker -t 9-20T10:5 Log this task
//adds task "Log this task" and sets the month to September, the day to 20th, the hour to 10 and the minute to 5 (yyyy-09-20T10:05).

timetracker -t 2015-9-20T10:5 Log this task
//adds task "Log this task" and sets the year to 2015, the month to September, the day to 20th, the hour to 10 and the minute to 5 (2015-09-20T10:05).
```

### move

The `--move` flag or the `-m` alias will move the task from the time that is set to the time that is configured by `move` (equal behavior as at).

#### Example

```shell
timetracker -t 10:5 -m 20:10
//moves task from 10:05 to 20:10
```

### delete

The `--delete` flag or the `-D` alias will delete the task from the time that is set.

#### Example

```shell
timetracker -t 10:5 -D
//deletes task from 10:05
```

### output

The `--print` flag or the `-p` alias will output the tracked tasks of the current day.

#### Example

```shell
timetracker -p
//outputs all tasks of the current day to the console

timetracker -p > time.txt
//writes all tasks of the current day to a file with the name time.txt
```

### from

The `--from` flag will set a range for the output of the tracked tasks.

#### Example

```shell
timetracker -p --from yyyy-mm-dd
//outputs all tasks between the from date and the current date
```

### to

The `--to` flag will set a range for the output of the tracked tasks.

#### Example

```shell
timetracker -p --from yyyy-mm-dd --to yyyy-mm-dd
//outputs all tasks between the from date and the to date
```

### config/user

All options and translations that are set in the ./config/default.json can be overridden by the ./config/user file. It can be a json-file like the default configuration, but it is also possible to have a user.js file that exports a configuration object.

The default configuration and the user configuration will be merged by lodashs defaultsDeep-function.

#### Example

Renamed `at`-alias to `a` and translated `taskAdded`-message.

```js
{
    "args": {
        "options": {
            "at": { "alias": "a" },
        }
    },
    "i18n": {
        "taskAdded": "Aufgabe hinzugefügt."
    }
}
```

As JSON-object or as JavaScript-module

```js
module.exports: {
    args: {
        options: {
            at: { alias: 'a' },
        }
    },
    i18n: {
        taskAdded: 'Aufgabe hinzugefügt.'
    }
}
```

#### Alfred-Workflow

The alfred-workflow will currently only work if you have nvm installed (~/.nvm/nvm.sh must be available)
