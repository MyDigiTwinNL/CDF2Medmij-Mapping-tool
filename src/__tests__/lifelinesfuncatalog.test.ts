import {lifelinesMeanDate} from '../lifelinesFunctions'

test('Mean between dates', () => {
  
    
    const date1="5/2001"
    const date2="5/2003"
    
    expect(lifelinesMeanDate(date1,date2)).toBe("5/2002")    
  
  });
  