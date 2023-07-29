import {lifelinesMeanDate} from '../lifelinesFunctions'

test('Mean between dates', () => {
  
    
    const date1="2001-5"
    const date2="2003-5"
    
    expect(lifelinesMeanDate(date1,date2)).toBe("2002-5")    
  
  });
  