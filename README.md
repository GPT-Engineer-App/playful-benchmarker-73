# playful-benchmarker

A project named "lovable-benchmarks".

This project will be a tool for automated benchmarking of GPT Engineer. It will work by having a set of benchmark scenarios, and in each scenario an LLM will pretend to be a user using the product in order to build some specific web app. The LLM pretending to be a user acts according to a prompt describing what the imaginated user wants to achieve in the scenario.

Each scenario also has a set of review prompts, and after the scenario has finished, the result is reviewed by another set of LLMs in order to assess how well the system scored on various dimensions, such as "Coding > Debugging" (how well the system debugs errors it introduces), "Coding > Dependencies" (how well the system handles adding/removing/modifying dependencies), "Limitation awareness" (how aware the system is of its limitations and how well it communicates its limits to the user).

The will be various dashboards and graphs showing the performance of different versions of the system. There will also be a UI for editing the benchmark scenario prompts.

For now, though, just set up a basic layout and an about page.

## Collaborate with GPT Engineer

This is a [gptengineer.app](https://gptengineer.app)-synced repository 🌟🤖

Changes made via gptengineer.app will be committed to this repo.

If you clone this repo and push changes, you will have them reflected in the GPT Engineer UI.

## Tech stack

This project is built with .

- Vite
- React
- shadcn-ui
- Tailwind CSS

## Setup

```sh
git clone https://github.com/GPT-Engineer-App/playful-benchmarker.git
cd playful-benchmarker
npm i
```

```sh
npm run dev
```

This will run a dev server with auto reloading and an instant preview.

## Requirements

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
