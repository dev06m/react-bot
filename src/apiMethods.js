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
        return await axios.get('https://api.shadowpay.com/api/v2/user/items/prices?token=' + token, {
            params: {
                search: itemName
            }
        }).then(response => {
            console.log(response.data.data.find(item => item.steam_market_hash_name == itemName).price)
            return response.data.data.find(item => item.steam_market_hash_name == itemName).price;
        }).catch(error => {
            console.log(error)
        })
}

export const min_fiyat_getir_envanter = async () =>
{
        return await axios.get('https://api.shadowpay.com/api/v2/user/items/prices?token=' + token)
            .then(response => {
                console.log(response.data.data)
                return response.data.data;
            }).catch(error => {
                console.log(error)
            })
}

export const MakeOffer = async (itemm, price, miliseconds) => { // update yaparken

    const item = [{id: itemm.asset_id, price: price, project: 'csgo', currency: 'USD'}] // update yaptigimiz icin id olmasi lazim (item id si)
        
    const response = await axios.post('https://api.shadowpay.com/api/v2/user/offers?token=' + token, 
    {
        offers: item 
    });

    return response;

}

export const UpdateOffer = async (itemm, price, miliseconds) => { // update yaparken
    debugger
    const item = [{id: itemm.id, price: price, currency: 'USD'}] // update yaptigimiz icin id olmasi lazim (item id si)
        
    const response = await axios.patch('https://api.shadowpay.com/api/v2/user/offers?token=' + token, 
    {
        offers: item 
    });

    return response;

}

export const SatistakiItemFiyatiGetir = async (itemName) =>
  {
    var satistakiItemler = await GetItemsOnOffers();
    console.log(satistakiItemler)
    var itemObject = null;
    if(satistakiItemler.length > 0)
        itemObject =  satistakiItemler.find(item => item.steam_item.steam_market_hash_name === itemName);
    if(itemObject !== null && itemObject !== undefined)
        return itemObject.price;  
    else
        return null;
}
  
export const GetItemsOnOffers = async () =>
  {
    return await axios.get('https://api.shadowpay.com/api/v2/user/offers?token=' + token)
    .then(response => {
        return response.data.data;
    });
    
}

export const GetAllInventoryItems = async () => {
    const inventory_response = await axios.get('https://api.shadowpay.com/api/v2/user/inventory?token=' + token);

    return inventory_response.data.data;
}
  

export const GetInventoryItems = async () => {
    const item_names = [];
    const inventory_array = [];
    const offers_array = [];
    const final_array = [];
    await axios.get('https://api.shadowpay.com/api/v2/user/inventory?token=' + token)
    .then(response => {
        response.data.data.map(async(item) => {
            //debugger
            if (!item_names.includes(item.steam_market_hash_name) && item.tradable == true) {
                // const min_fiyat = await min_fiyat_getir(item.steam_market_hash_name)
                // item = {...item, min_fiyat: min_fiyat}
                inventory_array.push({...item, count: 1})
                item_names.push(item.steam_market_hash_name)
            }else {
                inventory_array.map(x => x.steam_market_hash_name === item.steam_market_hash_name ? x.count++ : x.count)
            }
        })
    }).catch(e => console.log(e));
    await axios.get('https://api.shadowpay.com/api/v2/user/offers?token=' + token)
    .then(response => {
        response.data.data.map(item => {
            offers_array.push(item);
        })
    }).catch(e => console.log(e));
    
    //final_array = {first: inventory_array, second: offers_array}
    final_array.push(inventory_array);
    final_array.push(offers_array);
    console.log(final_array)
    return final_array;
}

export const fetchItemById = async (asset_id) => {
    const response = await GetItemsOnOffers(asset_id);
    
    return response.find(item => item.asset_id === asset_id);
}
  

