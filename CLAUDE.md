# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This repository contains a single Swagger 2.0 API specification file (`Customer e-Services_1541185271570.json`) for the **DEWA (Dubai Electricity and Water Authority) Customer e-Services API** (version 5.0). It was exported from TCI and targets the host `api.qa.dewa.gov.ae`.

There is no application code, build system, or test suite — the entire content is the OpenAPI/Swagger spec.

## API Specification Structure

The spec defines four GET endpoints across two functional groups:

**Enquiry endpoints** (query by `contractaccount` — 10-digit number, passed as a path parameter):
- `GET /enquiry/{contractaccount}` — bill enquiry returning outstanding charges (electricity, water, sewerage, cooling, DM fees)
- `GET /enquiry/consumption/rate/{contractaccount}` — slab tariff rates for electricity and water

**Status endpoints** (query by `username` — passed as a header):
- `GET /status/powerinterruption` — planned/active power interruptions affecting the user's area
- `GET /status/roadworks` — roadworks notifications affecting the user's area (includes x/y coordinates)

All responses are JSON arrays (`application/json`). All endpoints return `200` on success or a generic `Error` object (`code`, `message`, `fields`) on failure.

## Key Domain Concepts

- **Contract Account** (`contractaccount`): 10-digit utility reference number — the primary identifier for bill/rate lookups
- **Consumer Number** (`consumernumber`): 10-digit consumer account number, distinct from contract account
- **Business Partner** (`businesspartner`): separate identifier used in power interruption records
- **Account Status**: `N` = normal, `C` = collective child account
- **Customer Category**: `E` = Non-National, `N` = National — affects tariff rates

## Working with This Spec

To validate or use this spec, standard Swagger/OpenAPI tooling applies:

```bash
# Validate with swagger-cli (if installed)
swagger-cli validate "Customer e-Services_1541185271570.json"

# Generate a client with openapi-generator (if installed)
openapi-generator generate -i "Customer e-Services_1541185271570.json" -g <language> -o ./client
```

When editing the spec, note that the file uses Swagger 2.0 (not OpenAPI 3.x) — `$ref` paths use the `#/definitions/` prefix, not `#/components/schemas/`.
