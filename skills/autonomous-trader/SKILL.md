# Autonomous Silver Trading Bot

**Version:** 1.0  
**Created:** February 7, 2026  
**Platform:** Interactive Brokers (IBKR) via TWS API  
**Language:** Python 3.11+  
**Status:** Paper trading ready, live trading requires approval

---

## Overview

A fully autonomous trading bot designed to trade **SILVER** (SLV ETF and silver futures) with optional cryptocurrency trading during off-market hours. Built specifically for McKinzie's trading account with strict risk management and Telegram reporting.

### Key Features

✅ **Multiple Strategies:**
- Mean reversion (RSI + Bollinger Bands)
- Grid trading (range-bound markets)
- Automatic strategy selection based on volatility

✅ **Risk Management:**
- 2% per-trade risk limit
- 5% daily loss limit (auto-stop)
- 15% total drawdown limit (emergency stop)
- Position size calculator
- Trailing stop losses

✅ **Telegram Integration:**
- Real-time trade alerts
- Daily performance summaries
- Risk limit warnings
- Connection status updates

✅ **24/7 Trading:**
- Silver during market hours (7:30 AM - 2:00 PM MT)
- Crypto (ETH/BTC) during off-hours (optional)

✅ **Complete Logging:**
- SQLite database for all trades
- Performance analytics
- Equity curve tracking
- Strategy comparison

✅ **Backtesting:**
- Test strategies on historical data
- Compare performance metrics
- Risk-free strategy validation

---

## Quick Start

### 1. Setup

```bash
cd /Users/mmcassistant/clawd/projects/autonomous-trader
./setup.sh
```

This will:
- Create Python virtual environment
- Install all dependencies
- Initialize database
- Test connections

### 2. Configure Environment

Edit `~/.clawdbot/.env`:

```bash
# Telegram (required)
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=8417770794

# For live trading (keep false for paper)
IBKR_LIVE_APPROVED=false

# Crypto (optional, for off-hours trading)
CRYPTO_API_KEY=your_kraken_api_key
CRYPTO_API_SECRET=your_kraken_secret
```

### 3. Start Interactive Brokers

**Paper Trading:**
1. Open TWS or IB Gateway
2. Login with paper trading account
3. Go to: **File → Global Configuration → API → Settings**
4. Enable "ActiveX and Socket Clients" ✓
5. Socket port: **4002** (paper) or **4001** (live)
6. Add trusted IP: **127.0.0.1**
7. Click OK and restart TWS

### 4. Run Backtest (Recommended First)

```bash
source venv/bin/activate
python3 backtest.py
```

This downloads recent SLV data and tests the mean reversion strategy. Review results before live trading.

### 5. Start Bot

```bash
source venv/bin/activate
python3 bot.py
```

Bot runs every 15 minutes, analyzing market data and executing trades when signals trigger.

**To stop:** Press `Ctrl+C` for graceful shutdown

---

## Trading Strategies

### Strategy 1: Mean Reversion (Primary)

**Entry Signals (BUY):**
1. **Strong:** RSI < 30 AND price at lower Bollinger Band → 90% confidence
2. **Panic Buy:** Daily drop ≥ 3% → 85% confidence (catch panic selling)
3. **Moderate:** RSI < 30 only → 60% confidence

**Exit Signals (SELL):**
1. RSI > 70 (overbought)
2. Price hits upper Bollinger Band
3. Stop loss hit (2% below entry)
4. Take profit hit (4% above entry)

**Best For:** High volatility periods (5-10% daily swings)

**Example Trade:**
```
SLV drops from $80 to $73 (-9%) in one day
RSI: 25 (oversold)
Price: $73.20 (at lower BB)
→ BUY signal: 90% confidence
→ Enter: $73.20, Stop: $71.74, Target: $76.13
→ Risk/Reward: 2:1
```

### Strategy 2: Grid Trading (Secondary)

**Setup:**
- Create 5 buy levels at 2% intervals below current price
- Create 5 sell levels at 2% intervals above current price
- Execute limit orders at each level

**Example Grid at $78:**
```
SELL Levels:
$79.56 (+2.0%)  ←─┐
$79.17 (+1.5%)    │
$78.78 (+1.0%)    │ Take profits
$78.39 (+0.5%)    │
                  │
$78.00 ←─────────┬─ Current price
                  │
$77.61 (-0.5%)    │
$77.22 (-1.0%)    │ Buy opportunities
$76.83 (-1.5%)    │
$76.44 (-2.0%)  ←─┘
```

**Best For:** Range-bound, lower volatility markets

**Grid resets when:**
- Price moves >10% from grid center
- Weekly (every Sunday)

### Strategy 3: Crypto Off-Hours (Optional)

**ETH Grid Trading:**
- 1% spacing (tighter than silver due to volatility)
- Active during non-market hours
- Auto-pauses during market hours

**BTC Mean Reversion:**
- 4-hour timeframe
- RSI (21 period)
- Less aggressive than silver

**When Active:**
- Weekends
- Weekday pre-market (before 7:30 AM MT)
- Weekday after-hours (after 2:00 PM MT)

---

## Risk Management

### Position Sizing

**Formula:**
```
Position Size = min(
    Account * 10%,  # Base size
    (Account * 2%) / (Entry - Stop)  # Risk-based
)
```

**Limits:**
- Never exceed 30% of account in one position
- Maximum 3 concurrent positions
- Positions auto-reduced by 50% if weekly loss > 10%

### Stop Losses

**Types:**
1. **Fixed:** 2% below entry (default)
2. **ATR-based:** 2x Average True Range (for volatile markets)
3. **Trailing:** 1.5% trailing stop (locks in profits)

**Example:**
```
Buy SLV @ $78.00
Fixed stop: $76.44 (-2%)
Take profit: $81.12 (+4%)
If price → $81, trailing stop → $79.79
```

### Risk Limits (Enforced Automatically)

| Limit | Threshold | Action |
|-------|-----------|--------|
| **Per Trade** | 2% of account | Max risk per position |
| **Daily Loss** | 5% of account | ⚠️ STOP ALL TRADING for the day |
| **Weekly Loss** | 10% of account | ⚠️ Reduce position sizes 50% |
| **Total Drawdown** | 15% from peak | 🚨 STOP ALL TRADING + alert McKinzie |

**When limits hit:**
- Automatic halt
- Telegram alert sent
- Manual intervention required to resume
- All positions evaluated

---

## Telegram Notifications

### Trade Alerts

```
🟢 BUY EXECUTED

📊 SLV
Quantity: 12 shares
Price: $78.45
Total: $941.40

Strategy: silver_mean_reversion
Reason: RSI oversold (28.5) + at lower BB

⏰ 2026-02-07 10:30:15 MT
```

### Daily Summary (4 PM MT)

```
📈 DAILY TRADING SUMMARY
2026-02-07

💵 Account
Value: $103.50
Daily P&L: +$3.50 (+3.5%)

📊 Trading Activity
Trades: 5 (3W/2L)
Win Rate: 60.0%

🎯 Open Positions
• SLV: 10 shares @ $78.50 ($785.00)

📈 Strategy Performance
• silver_mean_reversion: 3 trades, +2.5%
• silver_grid: 2 trades, +1.0%
```

### Risk Alerts

```
🚨 RISK ALERT - CRITICAL

Type: TOTAL_DRAWDOWN_LIMIT

Drawdown reached 15.2% (limit: 15.0%)
ALL TRADING STOPPED

Current Metrics:
• Account: $84.80
• Peak: $100.00
• Drawdown: $15.20 (-15.2%)

⏰ 2026-02-07 11:45:23 MT
```

---

## Database & Logging

### Trade Log (`trades.db`)

**Schema:**
```sql
trades:
  - id, timestamp, symbol, action
  - quantity, price, total_value
  - strategy, reason
  - pnl, pnl_pct
  - entry_price, exit_price, hold_duration

account_snapshots:
  - timestamp, account_value, cash
  - positions_value, daily_pnl, total_return_pct

positions:
  - symbol, quantity, entry_price, entry_time
  - strategy, stop_loss, take_profit
```

### Query Trades

```python
from trade_logger import TradeLogger

tl = TradeLogger()

# Get today's trades
today_trades = tl.get_daily_trades()

# Performance metrics
metrics = tl.calculate_performance_metrics()
print(f"Win rate: {metrics['win_rate']:.1f}%")

# Generate report
print(tl.generate_report('today'))
print(tl.generate_report('week'))
print(tl.generate_report('all'))
```

### Performance Metrics

Tracked automatically:
- **Win Rate:** % of profitable trades
- **Profit Factor:** Total wins / total losses
- **Sharpe Ratio:** Risk-adjusted returns
- **Max Drawdown:** Largest peak-to-trough decline
- **Average Win/Loss:** Mean P&L per trade
- **Best/Worst Trade:** Extremes

---

## Backtesting

### Run Backtest

```bash
python3 backtest.py
```

Downloads last 3 months of SLV data and simulates strategy.

**Output:**
```
============================================================
BACKTEST RESULTS
============================================================

Final Capital: $112.50
Total Return: +$12.50 (+12.50%)

Total Trades: 45
Win Rate: 62.2%
Average Win: $1.85
Average Loss: $0.92
Profit Factor: 2.15

Sharpe Ratio: 1.82
Max Drawdown: 8.34%
============================================================
```

### Custom Backtest

```python
from backtest import Backtest

bt = Backtest(initial_capital=100.0)

# Download specific date range
df = bt.download_slv_data(
    start_date="2025-01-01",
    end_date="2026-02-01"
)

# Test strategy
metrics = bt.run_strategy(df, strategy_name="mean_reversion")

# Plot results
bt.plot_results(save_path="my_backtest.png")
```

### Compare Strategies

```python
from backtest import compare_strategies

compare_strategies(df)
```

Runs multiple strategies on same data and outputs comparison table.

---

## Configuration

### Main Settings (`config.py`)

**Capital & Risk:**
```python
STARTING_CAPITAL = 100.0
MAX_RISK_PER_TRADE_PCT = 0.02  # 2%
DAILY_LOSS_LIMIT_PCT = 0.05     # 5%
TOTAL_DRAWDOWN_LIMIT_PCT = 0.15 # 15%
```

**Position Sizing:**
```python
MAX_POSITION_SIZE_PCT = 0.30  # 30% max in one position
POSITION_SIZE_PER_TRADE_PCT = 0.10  # 10% base size
```

**Strategy Parameters:**
```python
RSI_OVERSOLD = 30
RSI_OVERBOUGHT = 70
BB_PERIOD = 20
BB_STD_DEV = 2.0
GRID_SPACING_PCT = 0.02  # 2%
```

**Stop Loss & Take Profit:**
```python
STOP_LOSS_PCT = 0.02      # 2%
TAKE_PROFIT_PCT = 0.04    # 4%
TRAILING_STOP_PCT = 0.015 # 1.5%
```

### Validate Config

```bash
python3 config.py
```

Checks all settings are valid before trading.

---

## File Structure

```
autonomous-trader/
├── bot.py                  # Main orchestrator
├── config.py               # All configuration
├── indicators.py           # Technical indicators (RSI, BB, MACD, etc.)
├── strategy_silver.py      # Silver strategies
├── strategy_crypto.py      # Crypto strategies
├── risk_manager.py         # Risk limits & position sizing
├── trade_logger.py         # Database & logging
├── reporter.py             # Telegram notifications
├── backtest.py             # Backtesting engine
├── requirements.txt        # Python dependencies
├── setup.sh                # Setup script
├── SECURITY.md             # Security rules
├── trades.db               # SQLite database
└── backups/                # Daily database backups
```

---

## OpenClaw Integration

### Cron Job Setup

Add to OpenClaw cron:

```bash
# Run trading bot every 15 minutes during market hours
*/15 7-14 * * 1-5 cd /Users/mmcassistant/clawd/projects/autonomous-trader && source venv/bin/activate && python3 bot.py --run-once
```

### Agent Skills

The agent can:
- Start/stop the bot
- Check performance
- Generate reports
- Adjust risk parameters
- Review trade logs
- Send manual Telegram alerts

**Example commands:**
```python
# Check today's performance
exec("cd /projects/autonomous-trader && source venv/bin/activate && python3 -c 'from trade_logger import TradeLogger; tl = TradeLogger(); print(tl.generate_report(\"today\"))'")

# Get risk status
exec("cd /projects/autonomous-trader && source venv/bin/activate && python3 -c 'from risk_manager import RiskManager; rm = RiskManager(100); print(rm.get_risk_summary())'")
```

---

## Silver Market Context

### Current Status (Feb 2026)

- **Price:** ~$78/oz (SLV ~$78/share)
- **YoY Return:** +145% (massive bull run)
- **Volatility:** 5-10% daily swings
- **Recent:** Dropped 10%, bounced 4% same day

### Why Silver Now?

✅ **High volatility = opportunity** for mean reversion  
✅ **Strong trend** but frequent pullbacks  
✅ **Liquid market** (SLV has high volume)  
✅ **Clear support/resistance** levels  

### Trading Hours

**Silver (SLV):**
- NYSE: 9:30 AM - 4:00 PM ET (7:30 AM - 2:00 PM MT)
- Pre-market: 4:00 AM - 9:30 AM ET
- After-hours: 4:00 PM - 8:00 PM ET

**Silver Futures (SI):**
- COMEX: Nearly 24 hours (Sunday 6 PM - Friday 5 PM ET)

---

## Troubleshooting

### Bot won't connect to IBKR

**Check:**
1. Is TWS/Gateway running?
2. API enabled? (File → Global Config → API → Settings)
3. Port correct? (4002 for paper, 4001 for live)
4. Trusted IP added? (127.0.0.1)
5. TWS restarted after config change?

**Test connection:**
```bash
python3 -c "
import asyncio
from ib_insync import IB
async def test():
    ib = IB()
    await ib.connectAsync('127.0.0.1', 4002, clientId=999, timeout=5)
    print('Connected!')
    ib.disconnect()
asyncio.run(test())
"
```

### No Telegram alerts

**Check:**
1. Bot token set in `~/.clawdbot/.env`?
2. Chat ID correct? (8417770794)
3. Bot added to chat?

**Test:**
```bash
python3 reporter.py
```

### Bot not trading

**Possible reasons:**
1. Risk limit hit (check `get_risk_summary()`)
2. Insufficient signal strength (<70%)
3. No clear signals in current market
4. Daily loss limit reached
5. Paper mode vs live mode confusion

**Debug:**
```bash
python3 -c "
from config import validate_config, get_config_summary
if validate_config():
    print('Config valid')
    print(get_config_summary())
"
```

### Database errors

**Backup and recreate:**
```bash
cp trades.db backups/trades_$(date +%Y%m%d).db
python3 -c "from trade_logger import TradeLogger; TradeLogger()"
```

---

## Safety Checklist

Before going live:

- [ ] **Tested in paper mode for 30+ days**
- [ ] Strategies are profitable
- [ ] Risk limits never breached
- [ ] All Telegram alerts working
- [ ] Database logging working
- [ ] Emergency stop tested
- [ ] Reviewed all trades manually
- [ ] Understand all strategies
- [ ] Read SECURITY.md completely
- [ ] McKinzie approval obtained
- [ ] Set `IBKR_LIVE_APPROVED=true` in .env
- [ ] Changed `PAPER_TRADING=False` in config.py

**Start small:** Even in live mode, keep capital at $100 initially.

---

## Performance Expectations

### Conservative Estimates

Based on backtests and silver volatility:

**Monthly:**
- Target: 5-10% return
- Max drawdown: 8-12%
- Win rate: 55-65%
- Sharpe ratio: 1.5+

**Yearly:**
- Target: 60-120% return (if silver trend continues)
- Max drawdown: 15% (hard stop)

**Reality check:**
- Past performance ≠ future results
- Silver is volatile (good and bad)
- Risk management is key
- Stay disciplined

---

## Support

**Questions?** Ask McKinzie or check:
- Project files: `/Users/mmcassistant/clawd/projects/autonomous-trader/`
- Security rules: `SECURITY.md`
- Code comments: Each file heavily documented

**Issues?**
1. Check logs
2. Review trade history
3. Test in paper mode
4. Contact McKinzie via Telegram

---

## Future Enhancements

**Planned features:**
- ✨ Crypto exchange integration (Kraken API)
- ✨ Machine learning signal strength
- ✨ Multi-symbol correlation analysis
- ✨ Advanced chart pattern recognition
- ✨ Sentiment analysis (Twitter, news)
- ✨ Options strategies (covered calls)
- ✨ Portfolio rebalancing
- ✨ Tax loss harvesting

---

## Version History

**v1.0 (Feb 7, 2026):**
- Initial release
- Mean reversion strategy
- Grid trading strategy
- Risk management
- Telegram integration
- Backtesting engine
- Paper trading ready

---

**Built with ❤️ for McKinzie's trading success.**

*Trade smart. Manage risk. Let the bot work for you.*
