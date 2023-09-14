import axios from 'axios';
import { token } from './consts/Isimlendirmeler';


// export const searchImages = async (term) => {
//     const response = await axios.get('https://api.unsplash.com/search/photos', {
//       headers: {
//         Authorization: 'Client-ID 8O50V7bNzfKdVixwS9W9nZVdr0VnrCv9gmeimfdvp6Y',
//       },
//       params: {
//         query: term,
//       },
//     });
  
//     return response.data.results;
//   };
  
export const fetchSellingItems = async () => {
    const response = await axios.get('https://api.shadowpay.com/api/v2/user/offers?token=' + token);

    return response.data.data;
}

export const fetchItems = async () => {
    const response = await axios.get('https://api.shadowpay.com/api/v2/user/items?token=' + token, 
);

return response.data.data;
}



export const FirstPriceSet = async (item, baslangic_fiyati, minimum_fiyat, bir_saat_bekle) => {
    
    if (item == null)
    {
        console.log("İtem null geliyor\n");
        return "E";
    }
    const offer_item = {id: item.asset_id.toString(), price: baslangic_fiyati, project: 'csgo', currency: 'USD'}
    
    const response = await axios.post('https://api.shadowpay.com/api/v2/user/offers?token=' + token, 
    {
        offers: [offer_item]
    });

    return response;
}  

export const min_fiyat_getir = async (itemName) =>
{
    try {
        const response = await axios.get('https://api.shadowpay.com/api/v2/user/items/prices?token=' + token, {
            params: {
                search: itemName
            }
        });
        return response.data.data.find(item => item.steam_market_hash_name == itemName).price;
    }catch (error){
        console.log(error);
    }


}

export const MakeOffer = async (itemm, price, miliseconds) => { // update yaparken

    const item = [{id:'31084109034', price: 40, project: 'csgo', currency: 'USD'}] // update yaptigimiz icin id olmasi lazim (item id si)
        
    const response = await axios.post('https://api.shadowpay.com/api/v2/user/offers?token=' + token, 
    {
        offers: item 
    });

    return response;

}

export const SatistakiItemFiyatiGetir = async (itemName) =>
  {
    //debugger
      var satistakiItemler = await GetItemsOnOffers();
      var itemObject = null;

      itemObject =  satistakiItemler.find(item => item.steam_item.steam_market_hash_name === itemName);
  
  
      return itemObject.price;  
}
  
export const GetItemsOnOffers = async () =>
  {
    const response = await axios.get('https://api.shadowpay.com/api/v2/user/offers?token=' + token);
    
    return response.data.data;
}
  

export const GetInventoryItems = async () => {
    const inventory_response = await axios.get('https://api.shadowpay.com/api/v2/user/inventory?token=' + token);
    const offers_response = await axios.get('https://api.shadowpay.com/api/v2/user/offers?token=' + token);
    const item_names = [];
    const inventory_array = [];
    const offers_array = [];
    let final_array = [];
    
    inventory_response.data.data.map(async(item) => {
        //debugger
        if (!item_names.includes(item.steam_market_hash_name) && item.tradable == true) {
            // const min_fiyat = await min_fiyat_getir(item.steam_market_hash_name)
            // item = {...item, min_fiyat: min_fiyat}
            inventory_array.push({...item, count: 1})
            item_names.push(item.steam_market_hash_name)
        }else {
            inventory_array.map(x => x.steam_market_hash_name === item.steam_market_hash_name ? x.count++ : x.count)
        }
    });
    offers_response.data.data.map(item => {
        offers_array.push(item);
    })
    //final_array = {first: inventory_array, second: offers_array}
    final_array.push(inventory_array);
    final_array.push(offers_array);
    console.log(final_array)
    return final_array;
}

export const fetchItemById = async (asset_id) => {
    const response = await GetInventoryItems();
    
    return response.find(item => item.asset_id === asset_id);
}
  

