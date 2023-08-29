import { fetchJson } from '../../common/network'
// import { sanitize } from '../../common/sanitize'
import {
  convertAccount,
  convertAccountTransaction,
  convertCard,
  convertHumoCardTransaction,
  convertUzcardCardTransaction,
  convertVisaCardTransaction,
  convertWallet,
  convertWalletTransaction
} from './converters'

const lang = 'ru'
const appVersion = '2'
const mobileDevice = 'ZenMoney'
const baseUrl = 'https://umobile.ipakyulibank.uz:5444'

function ServerException (code, message) {
  this.code = code
  this.message = message
}

function throwBankError (response) {
  if (response.body.state === 'error') {
    ZenMoney.trace(response.body.error_text)
    throw new ServerException(response.body.code, response.body.error_text)
  }
}

export async function loginStart (login, password) {
  const endpoint = '/api-live/login/'

  const response = await fetchJson(baseUrl + endpoint, {
    method: 'POST',
    headers: {
      'x-mobileversion': appVersion,
      'x-mobiledevice': mobileDevice,
      'x-mobileid': ZenMoney.getData('mobileId')
    },
    body: {
      login,
      password,
      type: 'physic'
    },
    sanitizeRequestLog: { body: { password: true } }
  })

  console.assert(response.ok, 'unexpected login response', response)
  throwBankError(response)

  ZenMoney.setData('userId', response.body.data.id)
}

export async function loginConfirm (userId, code) {
  const endpoint = '/api-live/login/confirm/'
  const response = await fetchJson(baseUrl + endpoint, {
    method: 'POST',
    headers: {
      'x-mobileversion': appVersion,
      'x-mobiledevice': mobileDevice,
      'x-mobileid': ZenMoney.getData('mobileId')
    },
    body: {
      user_id: userId,
      code
    },
    sanitizeRequestLog: { body: { password: true } }
  })

  console.assert(response.ok, 'unexpected loginConfirm response', response)
  throwBankError(response)

  ZenMoney.setData('token', response.body.data.token)
  ZenMoney.setData('isFirstRun', false)
}

export async function getUserDevices () {
  const endpoint = '/api-live/user/devices/'

  const response = await fetchJson(baseUrl + endpoint, {
    method: 'POST',
    headers: {
      'x-mobileversion': appVersion,
      'x-mobiledevice': mobileDevice,
      'x-mobileid': ZenMoney.getData('mobileId'),
      'x-mobileapp': ZenMoney.getData('token')
    },
    sanitizeRequestLog: { headers: { 'x-mobileapp': true } }
  })

  console.assert(response.ok, 'unexpected getUserDevices response', response)
  throwBankError(response)

  return response.body.data
}

/**
 * Получить список карт платежной системы UzCard
 *
 * @returns массив карт платежной системы UzCard в формате Дзенмани
 */
export async function getUzcardCards () {
  const endpoint = '/uzcard'

  const response = await fetchJson(baseUrl + endpoint, {
    method: 'GET',
    headers: {
      lang,
      'app-version': appVersion,
      'device-id': ZenMoney.getData('deviceId'),
      token: ZenMoney.getData('token')
    },
    sanitizeRequestLog: { headers: { 'device-id': true, token: true } }
  })

  console.assert(response.ok, 'unexpected uzcard response', response)
  throwBankError(response)

  return response.body.data.map(convertCard).filter(card => card !== null)
}

export async function getCards () {
  const endpoint = '/api-live/cards/all/'

  const response = await fetchJson(baseUrl + endpoint, {
    method: 'POST',
    headers: {
      'x-mobileversion': appVersion,
      'x-mobiledevice': mobileDevice,
      'x-mobileid': ZenMoney.getData('mobileId'),
      'x-mobileapp': ZenMoney.getData('token')
    },
    sanitizeRequestLog: { headers: { 'x-mobileapp': true } }
  })

  console.assert(response.ok, 'unexpected getCards response', response)
  throwBankError(response)

  return response.body.data.map(convertCard).filter(card => card !== null)
}

/**
 * Получить список карт платежной системы Humo
 *
 * @returns массив карт платежной системы Humo в формате Дзенмани
 */
export async function getHumoCards () {
  const endpoint = '/humo'

  const response = await fetchJson(baseUrl + endpoint, {
    method: 'GET',
    headers: {
      lang,
      'app-version': appVersion,
      'device-id': ZenMoney.getData('deviceId'),
      token: ZenMoney.getData('token')
    },
    sanitizeRequestLog: { headers: { 'device-id': true, token: true } }
  })

  console.assert(response.ok, 'unexpected humo response', response)
  throwBankError(response)

  return response.body.data.map(convertCard).filter(card => card !== null)
}

/**
 * Получить список карт платежной системы Visa
 *
 * @returns массив карт платежной системы Visa в формате Дзенмани
 */
export async function getVisaCards () {
  const endpoint = '/visa'

  const response = await fetchJson(baseUrl + endpoint, {
    method: 'GET',
    headers: {
      lang,
      'app-version': appVersion,
      'device-id': ZenMoney.getData('deviceId'),
      token: ZenMoney.getData('token')
    },
    sanitizeRequestLog: { headers: { 'device-id': true, token: true } }
  })

  console.assert(response.ok, 'unexpected visa response', response)

  return response.body.data.map(convertCard).filter(card => card !== null)
}

/**
 * Получить список кошельков
 *
 * @returns массив кошельков в формате Дзенмани
 */
export async function getWallets () {
  const endpoint = '/wallet'

  const response = await fetchJson(baseUrl + endpoint, {
    method: 'GET',
    headers: {
      lang,
      'app-version': appVersion,
      'device-id': ZenMoney.getData('deviceId'),
      token: ZenMoney.getData('token')
    },
    sanitizeRequestLog: { headers: { 'device-id': true, token: true } }
  })

  console.assert(response.ok, 'unexpected wallet response', response)

  return response.body.data.map(convertWallet)
}

/**
 * Получить список счетов
 *
 * @returns массив счетов в формате Дзенмани
 */
export async function getAccounts () {
  const endpoint = '/account'

  const response = await fetchJson(baseUrl + endpoint, {
    method: 'GET',
    headers: {
      lang,
      'app-version': appVersion,
      'device-id': ZenMoney.getData('deviceId'),
      token: ZenMoney.getData('token')
    },
    sanitizeRequestLog: { headers: { 'device-id': true, token: true } }
  })

  console.assert(response.ok, 'unexpected account response', response)

  return response.body.data.map(convertAccount)
}

/**
 * Получить список транзакций по картам платежной системы UzCard
 *
 * @param cards массив карт платежной системы UzCard
 * @param fromDate дата в формате ISO8601, с которой нужно выгружать транзакции
 * @param toDate дата в формате ISO8601, по которую нужно выгружать транзакции
 * @returns массив транзакций в формате Дзенмани
 */
export async function getUzcardCardsTransactions (cards, fromDate, toDate) {
  let transactions = []

  for (const card of cards) {
    if (!ZenMoney.isAccountSkipped(card.id)) {
      const endpoint = '/cabinet/card-info'

      const response = await fetchJson(baseUrl + endpoint, {
        method: 'POST',
        headers: {
          'X-AppToken': ZenMoney.getData('token'),
          'X-AppKey': 'blablakey',
          'X-AppLang': 'ru',
          'X-AppRef': '/cabinet/login'
        },
        body: {
          id: card.id,
          type: 'uzcard'
        },
        sanitizeRequestLog: { headers: { token: true } }
      })

      console.assert(response.ok, 'unexpected uzcard/history response', response)

      transactions = transactions.concat(response.body.data.vpiska.map(transaction =>
        convertUzcardCardTransaction(card, transaction)))
    }
  }

  return transactions
}

/**
 * Получить список транзакций по картам платежной системы Humo
 *
 * @param cards массив карт платежной системы Humo
 * @param fromDate дата в формате ISO8601, с которой нужно выгружать транзакции
 * @param toDate дата в формате ISO8601, по которую нужно выгружать транзакции
 * @returns массив транзакций в формате Дзенмани
 */
export async function getHumoCardsTransactions (cards, fromDate, toDate) {
  let transactions = []

  for (const card of cards) {
    if (!ZenMoney.isAccountSkipped(card.id)) {
      const endpoint = '/humo/history?' +
        'cardId=' + card.id + '&' +
        'dateFrom=' + fromDate + '&' +
        'dateTo=' + toDate

      const response = await fetchJson(baseUrl + endpoint, {
        method: 'GET',
        headers: {
          lang,
          'app-version': appVersion,
          'device-id': ZenMoney.getData('deviceId'),
          token: ZenMoney.getData('token')
        },
        sanitizeRequestLog: { headers: { 'device-id': true, token: true } }
      })

      console.assert(response.ok, 'unexpected humo/history response', response)

      transactions = transactions.concat(response.body.data.map(transaction =>
        convertHumoCardTransaction(card, transaction)))
    }
  }

  return transactions
}

/**
 * Получить список транзакций по картам платежной системы Visa
 *
 * @param cards массив карт платежной системы Visa
 * @param fromDate дата в формате ISO8601, с которой нужно выгружать транзакции
 * @param toDate дата в формате ISO8601, по которую нужно выгружать транзакции
 * @returns массив транзакций в формате Дзенмани
 */
export async function getVisaCardsTransactions (cards, fromDate, toDate) {
  let transactions = []

  for (const card of cards) {
    if (!ZenMoney.isAccountSkipped(card.id)) {
      const endpoint = '/visa/history?' +
        'cardId=' + card.id + '&' +
        'dateFrom=' + fromDate + '&' +
        'dateTo=' + toDate

      const response = await fetchJson(baseUrl + endpoint, {
        method: 'GET',
        headers: {
          lang,
          'app-version': appVersion,
          'device-id': ZenMoney.getData('deviceId'),
          token: ZenMoney.getData('token')
        },
        sanitizeRequestLog: { headers: { 'device-id': true, token: true } }
      })

      console.assert(response.ok, 'unexpected visa/history response', response)

      transactions = transactions.concat(response.body.data.map(transaction =>
        convertVisaCardTransaction(card, transaction)).filter(transaction => transaction !== null))
    }
  }

  return transactions
}

/**
 * Получить список транзакций по кошелькам
 *
 * @param wallets массив кошельков
 * @param fromDate дата в формате ISO8601, с которой нужно выгружать транзакции
 * @param toDate дата в формате ISO8601, по которую нужно выгружать транзакции
 * @returns массив транзакций в формате Дзенмани
 */
export async function getWalletsTransactions (wallets, fromDate, toDate) {
  let transactions = []

  for (const wallet of wallets) {
    if (!ZenMoney.isAccountSkipped(wallet.id)) {
      const endpoint = '/wallet/history?' +
        'id=' + wallet.id + '&' +
        'startDate=' + fromDate + '&' +
        'endDate=' + toDate

      const response = await fetchJson(baseUrl + endpoint, {
        method: 'GET',
        headers: {
          lang,
          'app-version': appVersion,
          'device-id': ZenMoney.getData('deviceId'),
          token: ZenMoney.getData('token')
        },
        sanitizeRequestLog: { headers: { 'device-id': true, token: true } }
      })

      console.assert(response.ok, 'unexpected wallet/history response', response)

      transactions = transactions.concat(response.body.data.map(transaction =>
        convertWalletTransaction(wallet, transaction)))
    }
  }

  return transactions
}

/**
 * Получить список транзакций по счетам
 *
 * @param accounts массив счетов
 * @param fromDate дата в формате ISO8601, с которой нужно выгружать транзакции
 * @param toDate дата в формате ISO8601, по которую нужно выгружать транзакции
 * @returns массив транзакций в формате Дзенмани
 */
export async function getAccountsTransactions (accounts, fromDate, toDate) {
  let transactions = []

  for (const account of accounts) {
    if (!ZenMoney.isAccountSkipped(account.id)) {
      const endpoint = '/account/statement?' +
        'id=' + account.id + '&' +
        'startDate=' + fromDate + '&' +
        'endDate=' + toDate

      const response = await fetchJson(baseUrl + endpoint, {
        method: 'GET',
        headers: {
          lang,
          'app-version': appVersion,
          'device-id': ZenMoney.getData('deviceId'),
          token: ZenMoney.getData('token')
        },
        sanitizeRequestLog: { headers: { 'device-id': true, token: true } }
      })

      console.assert(response.ok, 'unexpected account/statement response', response)

      transactions = transactions.concat(response.body.data.map(transaction =>
        convertAccountTransaction(account, transaction)))
    }
  }

  return transactions
}
