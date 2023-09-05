
# TradingView Automation with Puppeteer

This Node.js script uses Puppeteer to automate actions on the TradingView website. It allows you to perform tasks like searching for stock information, switching between open tabs, and more.

## Prerequisites

- Node.js installed on your machine.

## Getting Started

1. Clone this repository to your local machine.

2. Install the required dependencies by running:

   ```bash
   npm install
   ```

3. Start the script:

   ```bash
   node newView.js
   ```

## Usage

- **Right Arrow Key**: Move to the next open tab.
- **Left Arrow Key**: Move to the previous open tab.
- **Up Arrow Key**: Open new stock information tabs (up to a defined limit).
- **Ctrl + O**: Manually open new tabs by entering stock names (comma-separated).
- **Ctrl + S**: Switch between open tabs by entering the tab name (symbol or page title).
- **Ctrl + C**: Exit the script.

## Configuration

- You can configure the number of open tabs (`numberOfPages`) and the number of tabs to open when pressing the up arrow key (`openNumberOfPages`) in the script.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- This script is for educational purposes and automation on websites should be used responsibly and in accordance with the website's terms of service.

---

Please adjust this README as needed, and don't forget to replace placeholders like `tradingview-automation.js` with your actual script filename and add a license file (`LICENSE`) if necessary.
