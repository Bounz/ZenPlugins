import { generateRandomString } from '../../common/utils'
import { BankMessageError } from '../../errors'
import {
  // checkUser,
  // getAccounts,
  // getAccountsTransactions,
  // getHumoCards,
  // getHumoCardsTransactions,
  getCards,
  loginStart,
  loginConfirm
  // getUserDevices
  // getUzcardCardsTransactions,
  // getVisaCards,
  // getVisaCardsTransactions,
  // getWallets,
  // getWalletsTransactions,
  // registerDevice,
  // sendSmsCode
} from './api'

export async function scrape ({ preferences, fromDate, toDate, isFirstRun }) {
  /**
   * FIRST RUN STEPS
   */
  if (isFirstRun) {
    const mobileId = 'zm-' + generateRandomString(16)
    ZenMoney.setData('mobileId', mobileId)
    await updateToken(preferences.login, preferences.password)
  }

  try {
    return await doScrape(fromDate, toDate)
  } catch (error) {
    if (error.code === 109) {
      ZenMoney.trace(error.message)
      throw new BankMessageError('Превышено максимальное количество устройств. Отвяжите устройство в приложении.', false)
    }
    await updateToken(preferences.login, preferences.password)
    return await doScrape(fromDate, toDate)
  }
}

async function updateToken (login, password) {
  try {
    await loginStart(login, password)
  } catch (error) {
    if (error.code === 100) {
      ZenMoney.trace(error.message)
      throw new BankMessageError(error.message, false)
    } else {
      throw new BankMessageError(error.message, false)
    }
  }

  const smsCode = await ZenMoney.readLine('Введите код из СМС сообщения')

  try {
    await loginConfirm(ZenMoney.getData('userId'), smsCode)
  } catch (error) {
    if (error.code === 100) {
      ZenMoney.console.error(error.error_text)
      ZenMoney.Error(error.error_text, true, false)
      return
    }
  }
  ZenMoney.setData('isFirstRun', false)
}

async function doScrape (fromDate, toDate) {
  /**
   * REGULAR STEPS - Get accounts
   */
  const cards = await getCards()
  // const humoCards = await getHumoCards()
  // const visaCards = await getVisaCards()
  // const wallets = await getWallets()
  // const accounts = await getAccounts()

  /**
   * REGULAR STEPS - Get transactions
   */
  // const from = fromDate.getTime()
  // const to = (toDate || new Date()).getTime()

  // const uzcardCardsTransactions = await getUzcardCardsTransactions(uzcardCards, from, to)
  // const humoCardsTransactions = await getHumoCardsTransactions(humoCards, from, to)
  // const visaCardsTransactions = await getVisaCardsTransactions(visaCards, from, to)
  // const walletTransactions = await getWalletsTransactions(wallets, from, to)
  // const accountTransactions = await getAccountsTransactions(accounts, from, to)

  /**
   * LAST STEP - Unloading
   */
  return {
    accounts: [
      ...cards
      // ...humoCards,
      // ...visaCards,
      // ...wallets,
      // ...accounts
    ],
    transactions: [
      // ...uzcardCardsTransactions,
      // ...humoCardsTransactions,
      // ...visaCardsTransactions,
      // ...walletTransactions,
      // ...accountTransactions
    ]
  }
}
