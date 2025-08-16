# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a React application built with Vite for analyzing CSV data from a gaming tournament. The application provides data visualization and analysis features for match results, player statistics, and tournament insights.

## Key Technologies
- React with Vite
- Recharts for data visualization
- PapaParse for CSV parsing
- Lucide React for icons

## Code Guidelines
- Use functional components with hooks
- Implement responsive design principles
- Follow modern React patterns and best practices
- Use descriptive variable and function names
- Add proper error handling for data parsing and display
- Implement loading states for better UX

## Data Structure
The CSV data contains gaming match information with the following columns:
- round: Tournament round
- match: Match number
- type: Match type (개인전/팀전)
- tier: Tier level
- map: Game map name
- team1/team2: Team numbers
- team1_players/team2_players: Player names
- winner: Winning team
- result: Match result
