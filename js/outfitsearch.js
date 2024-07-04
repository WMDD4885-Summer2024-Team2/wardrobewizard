import { fetchData } from "./utils.js";
import config from '../../resources/config.json' with { type: 'json' };

export const genreateOutfit = async (topOutfit = [], bottomOutfit = [], searchParams) => {

    let matchingOutfit=[];

    
    if(topOutfit.length === 0 || bottomOutfit.length === 0 )
        return matchingOutfit;

    if(searchParams === 'Auto'){

        for(const outfit of bottomOutfit ){
           // const topoutfit=topOutfit[Math.floor(Math.random() * topOutfit.length)];
            for(const topoutfit of topOutfit){
                const result = await fetchData(config.colormatchURL,'POST',{ 'top_hsv': topoutfit.color,'bot_hsv':outfit.color});
                if(result && result.length>0 ){
                    matchingOutfit.push([topoutfit,outfit]);
                }
            }
           

                
               
        }
        
    }

   
    return matchingOutfit;
};