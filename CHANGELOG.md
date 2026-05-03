# Changelog

# [2.2.2] - 2026-05-03

### Fixed

- Fixed YouTube Error 153 "Video player configuration error" by updating Content Security Policy to properly allow YouTube embeds
- Updated CSP directives to include necessary YouTube domains and permissions for iframe functionality

# [2.2.1] - 2026-05-03

### Fixed

- Fixed Docker build issue where static files were not found (`ENOENT: no such file or directory, stat '/dist/index.html'`)

## [2.2.0] - 2026-05-03

### Added
- Added support for analytics tracking to monitor user interactions and improve the app based on usage data.

## [2.1.0] - 2026-05-02

### Added
- Added Eurovision 2026
- Added Melodifestivalen 2026

## [2.0.1] - 2026-01-05

### Fixed
- Fixed minor bugs with mobile responsiveness.
- Updated descriptions for competitions.

## [2.0.0] - 2026-01-04

### Added

- Multi-competition support (Eurovision 2025, Melodifestivalen 2025)
- Landing page with competition selection
- SEO optimization with meta tags and structured data
- Updated UI design

## [1.1.2] - 2025-05-18

### Fixed

- Significantly reduced URL length

## [1.1.1] - 2025-05-18

### Fixed

- Updated share link generation to limit elo to 2 decimal places.

## [1.1.0] - 2025-05-18

### Added

- Added link to the YouTube video in the scoreboard for each song.
- Displayed the number of songs voted for, in addition to the percentage.
- Added so songs with least votes are more likely to appear in next round.

## [1.0.0] - 2025-05-18

### Added

- Added a new feature that allows users to generate shareable links to display their scoreboard.
- The scoreboard now only displays countries that have received votes.
- It also shows the percentage of countries that have been voted for.

### Fixed

- Resolved an issue where the displayed countries failed to update when a user voted.

## [0.0.1] - 2025-05-18

### Added

- Initial release
