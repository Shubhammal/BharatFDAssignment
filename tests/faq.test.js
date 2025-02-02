const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const FAQ = require('../models/FAQ');

chai.should();
chai.use(chaiHttp);

describe('FAQs', () => {
  beforeEach((done) => {
    FAQ.deleteMany({}, (err) => {
      done();
    });
  });

  describe('/GET FAQs', () => {
    it('it should GET all the FAQs', (done) => {
      chai.request(server)
        .get('/api/faqs')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });
  });
});