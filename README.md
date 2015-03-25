# Pivotal Importer

## Usage

All open issues

```
node index.js --repo <github repo> --owner <github owner> --pivotalid <pivotal project id>
```

All open issues filtered by label

```
node index.js --repo <github repo> --owner <github owner> --pivotalid <pivotal project id> --label "<github issue label>"
```

## Required config files

~/pivotal.json

```json
{
  "token": "<Pivotal token>"
}
```

~/github.json

```json
{
  "token": "<Github personal token>"
}
```
