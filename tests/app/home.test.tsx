import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "../../src/app/page";
import { loadEnvConfig } from '@next/env'

test("Page", async () => {
    loadEnvConfig(process.cwd())
    console.log(process.env);
 const page = await Page();
//  render(page);
//  expect(screen.getByRole("heading", { level: 1, name: "Home" })).toBeDefined();
});
