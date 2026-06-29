import zcatalyst_sdk
class DummyReq:
    headers = {'x-zc-projectid':'123','x-zc-environment':'Development', 'x-zc-project-domain':'catalyst.zoho.in', 'x-zc-cookie':'', 'x-zc-admin-cred':''}
try:
    app = zcatalyst_sdk.initialize(req=DummyReq())
    qm = app.quick_ml()
    print(dir(qm))
except Exception as e:
    print(e)
