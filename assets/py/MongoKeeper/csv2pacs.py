import csv
# import simplejson as json
import pymongo as mongo
import datetime as date
from bson.json_util import dumps

def getMongoConnection():
    try:
        return mongo.MongoClient('mongodb+srv://<User>:<Password>@archive-aws-1rx3j.mongodb.net/test?retryWrites=true')
    except mongo.errors.ConnectionFailure as error:
        print('Could not connect to server: %s', error)

def writeBulkPayments(payments):
    client = getMongoConnection()

    if client is None:
        #no connection established
        print('Could not find a Mongo Connection')
        return

    try:
        mongodb = client['archiveDB']
        mongocoll = mongodb['myCollection']
        mongocoll.insert_many(payments)
    except:
        print('Could not write to Mongo')

def getMtFormat(row):
    payment = {}
    payment['PaymentId'] = row['PmtId']
    payment['BizDataType'] = 'MT101'
    payment['DataCreationDate'] = '' + date.datetime.now().strftime("%Y-%m-%dT%H:%M:%S.000Z")

    transaction_data = ':20:' + row['TxId'] + '\n'
    transaction_data = transaction_data + ':23:' + row['InstrId'] + '\n'
    transaction_data = transaction_data + ':28D:1/1' + '\n'
    transaction_data = transaction_data + ':52A:' + row['DebtorFinInstnId'] + '\n'
    transaction_data = transaction_data + ':50H:/' + row['DebtorAccount'] + '\n'
    transaction_data = transaction_data + row['DebtorName'] + '\n'
    transaction_data = transaction_data + 'Debtor Addr Line 1 ' + '\n'
    transaction_data = transaction_data + 'Debtor Addr Line 2 ' + '\n'
    transaction_data = transaction_data + 'Debtor Addr Line 3 ' + '\n'
    transaction_data = transaction_data + ':30:/' + row['IntrBkSttlmDt'] + '\n'
    transaction_data = transaction_data + ':32B:' + row['Ccy'] + row['IntrBkSttlmAmt'] + '\n'
    transaction_data = transaction_data + ':57A:' + row['PayeeFinInstnId'] + '\n'
    transaction_data = transaction_data + ':59:/' + row['PayeeAccount'] + '\n'
    transaction_data = transaction_data + row['PayeeName'] + '\n'
    transaction_data = transaction_data + 'Payee Addr Line 1 ' + '\n'
    transaction_data = transaction_data + 'Payee Addr Line 2 ' + '\n'
    transaction_data = transaction_data + 'Payee Addr Line 3 ' + '\n'
    transaction_data = transaction_data + ':70:' + row['Purpose'] + '\n'

    payment['BizData'] = transaction_data

    return payment


def getPacsFormat(row):
    payment = {}
    payment['PaymentId'] = row['PmtId']
    payment['BizDataType'] = 'ISO20022'
    payment['DataCreationDate'] = '' + date.datetime.now().strftime("%Y-%m-%dT%H:%M:%S.000Z")

    settlement_amount = {}
    settlement_amount['Amount'] = row['IntrBkSttlmAmt']
    settlement_amount['Currency'] = row['Ccy']

    debtor = {}
    debtor['DebtorName'] = row['DebtorName']
    debtor['DebtorAccount'] = row['DebtorAccount']
    debtor['DebtorFinInstId'] = row['DebtorFinInstnId']

    creditor = {}
    creditor['PayeeName'] = row['PayeeName']
    creditor['PayeeAccount'] = row['PayeeAccount']
    creditor['PayeeFinInstId'] = row['PayeeFinInstnId']

    purpose = {}
    purpose['PurposeId'] = row['Purpose']

    transaction_data = {}
    transaction_data['End2EndId'] = row['EndToEndId']
    transaction_data['TransactionId'] = row['TxId']
    transaction_data['TransactionDate'] = row['IntrBkSttlmDt']
    transaction_data['SettlementAmount'] = settlement_amount
    transaction_data['Debtor'] = debtor
    transaction_data['Creditor'] = creditor
    transaction_data['Purpose'] = purpose

    biz_data = {}
    biz_data['InstructionID'] = row['InstrId']
    biz_data['Transaction'] = transaction_data

    payment['BizData'] = biz_data

    return payment


print('Start writing PACS and MT to Mongo Atlas: ' + date.datetime.now().strftime("%Y-%m-%dT%H:%M:%S.000Z"))

field_names = ('PmtId','InstrId','EndToEndId','TxId','IntrBkSttlmAmt','Ccy','IntrBkSttlmDt','DebtorName','DebtorAccount','DebtorFinInstnId','ClrSysMmbId','PayeeName','PayeeAccount','PayeeFinInstnId','Purpose')

for i in range(0, 25):
    csv_file = open('../../data/payments_mock_100000.csv', 'r')

    reader = csv.DictReader(csv_file, field_names)
    count = 0
    payments_pacs = []
    payments_mt = []

    for row in reader:
        # first line contains header
        if count > 0:
            payments_pacs.append(getPacsFormat(row))
            payments_mt.append(getMtFormat(row))

        count += 1

    # print("Json Pacs Data: ", payments_pacs)
    # print("Json MT Data: ", payments_mt)

    print("Write pacs payments to Mongo - count ", i)
    writeBulkPayments(payments_pacs)

    print("Write mt payments to Mongo - count ", i)
    writeBulkPayments(payments_mt)

    csv_file.close()

print('Finished writing PACS and MT to Mongo Atlas: ' + date.datetime.now().strftime("%Y-%m-%dT%H:%M:%S.000Z"))
