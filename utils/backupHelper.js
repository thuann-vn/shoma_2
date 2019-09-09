import moment from 'moment';
import { getUserAllData } from '../services/firebase';
import { ProductServices } from '../services/product';
import { CategoryServices } from '../services/category';
import { OrderServices } from '../services/order';
import { CustomerServices } from '../services/customer';
import { parseDate } from './dateHelper';

export const backupData = (firebase, state, callback) => {
    //Backup current data
    const user = firebase.auth().currentUser;
    if(user){
        firebase.database().ref('users/' + user.uid).once('value', (snapshot) => {
            if (snapshot.exists()){
                data = snapshot.val();
                var dateStr = moment().format('YYYYMMDD');
                data.backups = null;
                firebase.database().ref('backups/' + user.uid + '/' + dateStr).set(data);
            }
    
            if(callback){
                callback();
            }
        });
    }
}

export const checkIsMustBackupData = (lastDate, isProAccount = false) => {
    if (!lastDate) return true;
    
    let backupDays = 7;
    if(isProAccount){
        backupDays = 1;
    }
    return moment(new Date()).endOf('day').diff(moment(lastDate).startOf('day'), 'day') >= backupDays;
}

export const parseFBDate = (date)=>{
    if(!date){
        return null;
    }

    return typeof date.toDate == 'function' ? date.toDate() : new Date(date);
}

export const restoreData = (props) => {
    return Promise.all([
        //Get list products
        ProductServices.list().then(snapshot => {
            let docs = {};
            snapshot.docs.map(doc => {
                let data = doc.data();
                docs[data.id] = data;
            });

            props.resetProduct(docs);
        }),
        //Get list categories
        CategoryServices.list().then(snapshot => {
            let docs = {};
            snapshot.docs.map(doc => {
                let data = doc.data();
                docs[data.id] = data;
            });
    
            props.resetCategory(docs);
        }),
        //Get list orders
        OrderServices.list().then(snapshot => {
            let docs = {};
            snapshot.docs.map(doc => {
                let data = doc.data();

                //Get date
                data.createdDate = parseFBDate(data.createdDate);
                data.shippingDate = parseFBDate(data.shippingDate);
                data.paidDate = parseFBDate(data.paidDate);
                
                docs[data.id] = data;
            });
    
            props.resetOrder(docs);
        }),
        //Get list customers
        CustomerServices.list().then(snapshot => {
            let docs = {};
            snapshot.docs.map(doc => {
                let data = doc.data();
                docs[data.id] = data;
            });
            props.resetCustomer(docs);
        })
    ]);
}