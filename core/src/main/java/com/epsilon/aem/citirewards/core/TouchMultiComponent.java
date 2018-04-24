package com.epsilon.aem.citirewards.core;
 
import java.util.ArrayList;
import java.util.List;
   
import org.apache.sling.commons.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
   
import com.adobe.cq.sightly.WCMUsePojo;
 
import javax.jcr.Node;
import javax.jcr.Session;
import javax.jcr.NodeIterator; 
   
public class TouchMultiComponent extends WCMUsePojo {
   
    protected final Logger log = LoggerFactory.getLogger(this.getClass());
 
 
private List<TouchMultiBean> submenuItems = new ArrayList<TouchMultiBean>();
   
@Override
public void activate() throws Exception {
 
    Node currentNode = getResource().adaptTo(Node.class);
    NodeIterator ni =  currentNode.getNodes() ; 
     
    //get the grandchild node of the currentNode - which represents where the MultiField values are stored
    while (ni.hasNext()) {
         
        Node child = (Node)ni.nextNode(); 
         
        NodeIterator ni2 =  child.getNodes() ; 
        setMultiFieldItems(ni2); 
    }
}
   
/**
* Method to get Multi field data
* @return submenuItems
*/
private List<TouchMultiBean> setMultiFieldItems(NodeIterator ni2) {
   
try{
    
    String product;
    String link;
    String startDate;
    String show;
    String size;
    String imagelink;
 
    //THIS WILL READ THE VALUE OF THE CORAL3 Multifield and set them in a collection 
    while (ni2.hasNext()) {
         
        TouchMultiBean menuItem = new TouchMultiBean();
         
         
        Node grandChild = (Node)ni2.nextNode();
         
        log.info("*** GRAND CHILD NODE PATH IS "+grandChild.getPath());
         
        product= grandChild.getProperty("product").getString(); 
        link = grandChild.getProperty("link").getString(); 
        show = grandChild.getProperty("show").getString(); 
        startDate = grandChild.getProperty("startDate").getString();
        size = grandChild.getProperty("size").getString();
        imagelink = grandChild.getProperty("imagelink").getString();
        log.info("*** VALUE OF DATE IS "+startDate);
        log.info("*** VALUE OF IMAGE IS "+imagelink);
        
        menuItem.setProduct(product);
        menuItem.setLink(link);
        menuItem.setShow(show);
        menuItem.setDate(startDate); 
        menuItem.setImage(imagelink); 
        menuItem.setSize(size); 
        submenuItems.add(menuItem);
    }
}
   
catch(Exception e){
    log.error("Exception while Multifield data {}", e.getMessage(), e);
}
return submenuItems;
}
   
public List<TouchMultiBean> getMultiFieldItems() {
return submenuItems;
}
}