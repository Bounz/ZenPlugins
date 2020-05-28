import { convertTransaction } from '../../converters'

describe('convertTransaction', () => {
  const accounts = [
    {
      id: '30848200',
      type: 'card',
      title: 'Безымянная*1111',
      instrument: 'BYN',
      balance: 99.9,
      syncID: ['1111']
    }
  ]

  const tt = [
    {
      name: 'failed transaction',
      transaction: {
        status: 'ОТМЕНЕНО'
      },
      expectedTransaction: null
    },
    {
      name: 'cash add',
      transaction: {
        cardNum: '**** **** **** 1111',
        date: '2019-01-01 10:12:13',
        type: 'Выдача наличных',
        accountAmt: '10,13',
        status: 'ПРОВЕДЕНО',
        cardAcceptor: 'Выдача наличных в ATM'
      },
      expectedTransaction: {
        hold: false,
        date: new Date('2019-01-01T10:12:13+03:00'),
        movements: [
          {
            id: null,
            invoice: null,
            account: { id: '30848200' },
            sum: -10.13,
            fee: 0
          },
          {
            account: {
              company: null,
              instrument: undefined,
              syncIds: null,
              type: 'cash'
            },
            fee: 0,
            id: null,
            invoice: null,
            sum: 10.13
          }
        ],
        merchant: {
          fullTitle: 'Выдача наличных в ATM',
          location: null,
          mcc: null
        },
        comment: null
      }
    },
    {
      name: 'bank fees',
      transaction: {
        date: '2019-01-01 10:12:13',
        dateResp: '2019-01-01 10:12:13',
        type: 'Оплата',
        cardAcceptor: 'SMS OPOVESCHENIE>MINSK BY',
        transactionAmt: '2,8',
        transactionAmtCurrency: 'BYN',
        accountAmt: '2,8',
        accountAmtCurrency: 'BYN',
        feeAmt: 0,
        feeAmtCurrency: 'BYN',
        reflectedAccountAmt: '2,8',
        reflectedAccountAmtCurrency: 'BYN',
        reflectedFee: 0,
        reflectedFeeCurrency: 'BYN',
        balanceAmt: '167,57',
        balanceAmtCurrency: 'BYN',
        status: 'ПРОВЕДЕНО',
        sign: '-',
        operationColor: '_red',
        cardNum: '**** 1111',
        historyKey: 3
      },
      expectedTransaction: {
        hold: false,
        date: new Date('2019-01-01T10:12:13+03:00'),
        movements: [
          {
            id: null,
            invoice: null,
            account: { id: '30848200' },
            sum: -2.8,
            fee: 0
          }
        ],
        merchant: null,
        comment: 'SMS OPOVESCHENIE'
      }
    },
    {
      name: 'hold',
      transaction: {
        date: '2019-07-19 11:35:17',
        dateResp: '',
        type: 'Оплата',
        cardAcceptor: 'UBER>Schipol                          NL',
        transactionAmt: '0.06',
        transactionAmtCurrency: 'BYN',
        accountAmt: '0.06',
        accountAmtCurrency: 'BYN',
        feeAmt: 0,
        feeAmtCurrency: 'BYN',
        reflectedAccountAmt: '',
        reflectedAccountAmtCurrency: 'BYN',
        reflectedFee: 0,
        reflectedFeeCurrency: 'BYN',
        balanceAmt: '18,3',
        balanceAmtCurrency: 'BYN',
        status: 'ЗАБЛОКИРОВАНО',
        sign: '-',
        operationColor: '_red',
        cardNum: '**** 1111',
        historyKey: 5
      },
      expectedTransaction: {
        hold: true,
        date: new Date('2019-07-19T11:35:17+03:00'),
        movements: [
          {
            id: null,
            invoice: null,
            account: { id: '30848200' },
            sum: -0.06,
            fee: 0
          }
        ],
        merchant: {
          country: 'NL',
          city: 'Schipol',
          title: 'UBER',
          mcc: null,
          location: null
        },
        comment: null
      }
    }
  ]

  // run all tests
  for (const tc of tt) {
    it(tc.name, () => {
      const transaction = convertTransaction(tc.transaction, accounts)

      expect(transaction).toEqual(tc.expectedTransaction)
    })
  }
})
